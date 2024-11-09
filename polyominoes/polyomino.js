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
            shared_edge.push(corner);
        }
    }
    return shared_edge;
}




function isRVisible(guard, targetSquare, polyomino) {
    // Determine if the square is aligned horizontally or vertically with the guard
    if (guard.x !== targetSquare.x && guard.y !== targetSquare.y) return false; // Only aligned squares are visible

    // Check visibility along the x-axis if aligned horizontally
    if (guard.y === targetSquare.y) {
        const minX = Math.min(guard.x, targetSquare.x);
        const maxX = Math.max(guard.x, targetSquare.x);

        for (let square of polyomino) {
            if (square.active) {
                if (square.y === guard.y) {
                    if (square.x > minX && square.x < maxX) {
                        return false; // An active square interrupts visibility along the x-axis
                    }
                } else if (square.x === maxX || square.x === minX) {
                    // Boundary interruption case
                    if (!square.active && (square.y === guard.y)) {
                        return false; // Stop visibility at the boundary
                    }
                }
            }
        }
    }

    // Check visibility along the y-axis if aligned vertically
    if (guard.x === targetSquare.x) {
        const minY = Math.min(guard.y, targetSquare.y);
        const maxY = Math.max(guard.y, targetSquare.y);

        for (let square of polyomino) {
            if (square.active) {
                if (square.x === guard.x) {
                    if (square.y > minY && square.y < maxY) {
                        return false; // An active square interrupts visibility along the y-axis
                    }
                } else if (square.y === maxY || square.y === minY) {
                    // Boundary interruption case
                    if (!square.active && (square.x === guard.x)) {
                        return false; // Stop visibility at the boundary
                    }
                }
            }
        }
    }

    return true; // No obstacles or boundary interruptions found
}

function calculateVisibilityRegion(guard, polyomino) {
    const visibilityRegion = [];

    // Check each square to see if it is r-visible from the guard
    for (let square of polyomino) {
        if (square.active && isRVisible(guard, new Point(square.x, square.y), polyomino)) {
            visibilityRegion.push(square);
        }
    }

    return visibilityRegion;
}

// Define the Polyomino Class
class Polyomino {
    constructor(squares) {
        this.squares = squares;
        this.boundaries =[];
        this.vertices = [];
        this.guards = [];
        this.subPolyominoes = [];
        this.valid = isValid();
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
    }


    get_boundaries(){
       for (square of squares){
            if (square.active){
                neighbors = getDirectNeighbors(square, polyomino)
                for (neighbor of neighbors){
                    if (!neighbor.active){
                        this.boundaries.push(get_shared_edge(square, neighbor));
                    }
                }
            }
        }
    } 


    get_vertices(){
        for (edge of this.boundaries){
            for (point of edge){
                if (!vertices.includes(point)){
                    this.vertices.push(point);
                }
            }
        }
    } 
}