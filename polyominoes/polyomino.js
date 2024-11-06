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



function get_boundaries(polyomino){
    boundaries  =  [] // edges that are separating an active square from an inactive one
    for (square of polyomino){
        if (square.active){
            neighbors = getDirectNeighbors(square, polyomino)
            for (neighbor of neighbors){
                if (!neighbor.active){
                    boundaries.push(get_shared_edge(square, neighbor));
                }
            }
        }
    } return boundaries;
}

function get_vertices(polyomino){
    vertices = []
    for (edge of get_boundaries(polyomino)){
        for (point of edge){
            if (!vertices.includes(point)){
                vertices.push(point);
            }
        }
    } return vertices;
}

// Define the Point Class
class Polyomino {
    constructor(squares) {
        this.squares = squares;
        this.boundaries = get_boundaries(squares);
        this.vertices = get_vertices(squares);
        this.subPolyominoes = [];
        
    }
  }