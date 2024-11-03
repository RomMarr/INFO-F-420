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
    let nbSquares = getNbActiveSquares(squares)
    if (nbSquares == 0) return false;
    else if (nbSquares == 1) return true;

    let size = squares[0].length;
    for (let i =0; i< squares.length; i++){
        if (squares[i].active) {
            let neighbors = getDirectNeighbors(squares[i], squares);
            let atLeastOneNeighborActive = false;
            for (let neighbor of neighbors){
                atLeastOneNeighborActive = atLeastOneNeighborActive || neighbor.active;
            }
            if (!atLeastOneNeighborActive) return false;
        }
    
    }
    return true; // All squares are connected
}
