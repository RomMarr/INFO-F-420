function getSquareIndexAtPoint(point, squares) {
    
    // Loop through all squares to find one that contains the point
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].isInside(point.x, point.y)) { // Adjusting for button area
            return i; // Return the index of the square
        }
    }
    return -1; // Return -1 if no square contains the point
}
function areSquaresConnected(squares) {
    // Create a grid to keep track of occupied positions

    for (let i =0; i< squares.length; i++){
        if ((getSquareIndexAtPoint(new Point(squares[i].x-(squares[i].size/2), squares[i].y), squares) == -1) &&
         (getSquareIndexAtPoint(new Point(squares[i].x+(squares[i].size/2), squares[i].y), squares) == -1) &&
      (getSquareIndexAtPoint(new Point(squares[i].x, squares[i].y-(squares[i].size/2)), squares) == -1) &&
     (getSquareIndexAtPoint(new Point(squares[i].x, squares[i].y+(squares[i].size/2)), squares) == -1) ) return false;
    }
    return true; // All squares are connected
}
