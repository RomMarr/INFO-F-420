function getSquareIndexAtPoint(point, squares) {
    // Loop through all squares to find one that contains the point
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].isInside(point.x, point.y)) { // Adjusting for button area
            return i; // Return the index of the square
        }
    }
    return -1; // Return -1 if no square contains the point
}

function getNextSquareActive(point, squares){
    let squareNeighbor = getSquareIndexAtPoint(point, squares);
    if ( squareNeighbor == -1) return false;
    return squares[squareNeighbor].active;
}

function getActiveSquares(squares) {
    const activeSquares = [];
    for (let square of squares) {
        if (square.active) {
            activeSquares.push(square);
        }
    }
    return activeSquares;
}

function getNbActiveSquares(squares) {
    let count = 0;
    for (let square of squares) {
        if (square.active) {
            count++;
        }
    }
    return count;
}

function getDirectNeighbors(square, squares) {
    const squareSize = square.size;
    const neighbors = [];

    // Loop through all squares to find those adjacent to the given square
    for (let i = 0; i < squares.length; i++) {
        const other = squares[i];

        // Check if 'other' is to the left, right, above, or below the given square
        if (
            (other.x === square.x - squareSize && other.y === square.y) ||  // Left neighbor
            (other.x === square.x + squareSize && other.y === square.y) ||  // Right neighbor
            (other.y === square.y - squareSize && other.x === square.x) ||  // Above neighbor
            (other.y === square.y + squareSize && other.x === square.x)     // Below neighbor
        ) {
            neighbors.push(other); // Add the neighbor to the list
        }
    }

    return neighbors;
}


function areSquaresConnected(squares) {
    const nbActiveSquares = getNbActiveSquares(squares);
    if (nbActiveSquares === 0) return false; // No active squares to check
    if (nbActiveSquares === 1) return true;  // Only one square, it's trivially connected

    // Find the first active square as the starting point
    let startSquare = null;
    for (let square of squares) {
        if (square.active) {
            startSquare = square;
            break;
        }
    }

    // If no active square is found (shouldn't happen due to previous checks)
    if (!startSquare) return false;

    // Perform BFS/DFS to count reachable active squares
    const visited = new Set();
    const stack = [startSquare];
    let count = 0;

    while (stack.length > 0) {
        const square = stack.pop();

        // Use stringified coordinates as a unique key for each square
        const key = `${square.x},${square.y}`;
        if (visited.has(key)) continue;
        
        visited.add(key);
        count++;

        // Get active neighbors and add them to the stack
        const neighbors = getDirectNeighbors(square, squares);
        for (let neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (neighbor.active && !visited.has(neighborKey)) {
                stack.push(neighbor);
            }
        }
    }

    // If we've reached all active squares, they're connected
    return count === nbActiveSquares;
}

function get_shared_edge(square1, square2){
    let shared_edge = [];
    for (corner of square1.corners){
        if (corner in square2.corners){
            if (!square1.corners == square2.corners) shared_edge.push(corner);
        }
    }
    return shared_edge;
}




function isRVisible(guard, targetSquare, polyomino) {
    // Check if the target square is aligned horizontally or vertically with the guard
    if (guard.x !== targetSquare.x && guard.y !== targetSquare.y) return false; // Only aligned squares are visible

    const minX = Math.min(guard.x, targetSquare.x);
    const maxX = Math.max(guard.x, targetSquare.x);
    const minY = Math.min(guard.y, targetSquare.y);
    const maxY = Math.max(guard.y, targetSquare.y);

    // Traverse along x-axis if horizontally aligned
    if (guard.y === targetSquare.y) {
        for (let x = minX + guard.size; x < maxX; x += guard.size) {
            const point = new Point(x, guard.y);
            const index = getSquareIndexAtPoint(point, polyomino);

            if (index === -1 || !polyomino[index].active) {
                return false; // Stops visibility at the boundary or inactive square
            }
        }
    }

    // Traverse along y-axis if vertically aligned
    if (guard.x === targetSquare.x) {
        for (let y = minY + guard.size; y < maxY; y += guard.size) {
            const point = new Point(guard.x, y);
            const index = getSquareIndexAtPoint(point, polyomino);

            if (index === -1 || !polyomino[index].active) {
                return false; // Stops visibility at the boundary or inactive square
            }
        }
    }

    return true; // No obstacles or boundaries found in the visibility path
}




// Define the Polyomino Class
class Polyomino {
    constructor(squares) {
        this.squares = squares;
        this.boundaries =[];
        this.vertices = [];
        this.guards = [];
        this.subPolyominoes = [];
        this.valid = this.isValid();
        this.visibility = []; // each elem is : (guard, list of squares it can see)
    }

    getSquares(){
        return this.squares
    }

    setSquares(squares){
        this.squares = squares;
    }

    isValid(){
        if (areSquaresConnected(this.squares)){
            this.squares = getActiveSquares(this.squares);
            return true;
        }return false;
    }

    start(){
        this.get_boundaries();
        this.get_vertices();
        this.place_first_guard();
        this.calculateVisibilityRegion(this.guards[0]);
        //this.next_steps();
    }


    get_edges(square) {
        let edges = [];
        let corners = square.corners;
        for (let i = 0; i < corners.length; i++) {
            edges.push([corners[i], corners[(i + 1) % corners.length]]);
        }
        return edges;
    }
    
    get_boundaries() {
        for (let square of this.squares) {
            if (square.active) {
                let boundaries = this.get_edges(square); // Get edges of active square
                let neighbors = getDirectNeighbors(square, this.squares); // Find active neighbors
                for (let neighbor of neighbors) {
                    if (neighbor.active) {
                        // Get edges of neighboring active square
                        for (let edge of this.get_edges(neighbor)) {
                            // Find the reverse edge in boundaries
                            let reverseEdge = [edge[1], edge[0]];
                            let index = boundaries.findIndex(boundaryEdge => arraysEqual(boundaryEdge, reverseEdge));
                            if (index !== -1) {
                                // Remove the boundary edge if the reverse edge is found in the neighbor
                                boundaries.splice(index, 1);
                            }
                        }
                    }
                }
    
                // Add remaining boundaries to `this.boundaries`
                for (let boundary of boundaries) {
                    this.boundaries.push(boundary);
                }
            }
        }
    }


    get_vertices(){
        for (let edge of this.boundaries){
            for (let point of edge){
                console.log(point);
                if (!pointExistsInArray(point, this.vertices)){
                    this.vertices.push(point);
                }
            }
        }
    } 

    place_first_guard(){
        console.log(this.boundaries);
        this.guards.push(this.boundaries[0][0]);
    }

    calculateVisibilityRegion(guard) {
        const visibilityRegion = [];
        // Check each square to see if it is r-visible from the guard
        for (let square of this.squares) {
            if (square.active && isRVisible(guard, new Point(square.x, square.y), this.squares)) {
                visibilityRegion.push(square);
                square.watched = true;
            }
        }
        this.visibility.push([guard,visibilityRegion]) ;
    }
}