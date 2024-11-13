function getSquareIndexAtPoint(point, squares) {
    // Loop through all squares to find one that contains the point
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].isInside(point.x, point.y)) { // Adjusting for button area
            return i; // Return the index of the square
        }
    }
    return -1; // Return -1 if no square contains the point
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

function get_connected_squares(square, squares) {
    let stack = [square];
    let connected_squares = [square];
    while (stack.length != 0) {
        console.log('stack' , stack)
        actual_square = stack.pop();
        console.log('actual square', actual_square);
        for (let neighbor of getDirectNeighbors(actual_square,squares)) {
            if (!connected_squares.includes(neighbor)) {
                connected_squares.push(neighbor);
                stack.push(neighbor);
            }
        }
    } return connected_squares;
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




// Define the Polyomino Class
class Polyomino {
    constructor(squares) {
        this.squares = squares;
        this.size = 0;
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
            this.size = this.squares[0].size;
            return true;
        }return false;
    }

    start(){
        this.get_boundaries();
        this.get_vertices();
        this.place_first_guard();
        this.r_visibility(this.guards[0]);
        this.generate_subpolyominoes();
        this.next_steps();
    }

    next_steps(){
        
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
                if (!pointExistsInArray(point, this.vertices)){
                    this.vertices.push(point);
                }
            }
        }
    } 

    place_first_guard(){
        let random_vertex = this.vertices[floor(Math.random() * this.vertices.length)];
        this.guards.push(random_vertex);
    }

    is_renctangle_watched(p,q){
        let squares_of_rectangle = [];
        let coordinates = getRectangle(p,q);
        let min_x = coordinates[0];
        let min_y = coordinates[1];
        let max_x = coordinates[2];
        let max_y = coordinates[3];
        for (let x = min_x + this.size/2 - 1; x <= max_x; x+= this.size){
            for (let y = min_y+ this.size/2 - 1; y <= max_y; y+= this.size){
                let index = getSquareIndexAtPoint(new Point(x,y), this.squares); 
                if (index == -1){
                    return null;
                } squares_of_rectangle.push(this.squares[index]);
            }
            
        }
        return squares_of_rectangle;
    }

    r_visibility(guard){
        let squares_to_check = this.squares.slice();
        while (squares_to_check.length != 0 ) {
            let point = squares_to_check.pop().middle;
            let squares_of_rectangle = this.is_renctangle_watched(guard,point);
            if (squares_of_rectangle != null){
                for (let square of squares_of_rectangle){
                    let index = squares_to_check.indexOf(square);
                    if (index != -1) squares_to_check.splice(index,1);
                    if (!square.watched) square.watched = true;
                }
            }
        }
    }

    get_unwatched_squares(){
        let unwatched_squares = []
        for (let square of this.squares){
            if (!square.watched) unwatched_squares.push(square);
        }return unwatched_squares;
    }

    generate_subpolyominoes() {
        let unwatched = this.get_unwatched_squares();
        while (unwatched.length > 0) {
            let squares_connected = get_connected_squares(unwatched[0], unwatched);
            this.subPolyominoes.push(new Polyomino(squares_connected));
            for (let square_used of squares_connected) {
                let index = unwatched.indexOf(square_used);
                unwatched.splice(index,1);
            }
        }
    }
    
}