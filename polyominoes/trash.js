// function getNextSquareActive(point, squares){
//     let squareNeighbor = getSquareIndexAtPoint(point, squares);
//     if ( squareNeighbor == -1) return false;
//     return squares[squareNeighbor].active;
// }

// function get_shared_edge(square1, square2){
//     let shared_edge = [];
//     for (corner of square1.corners){
//         if (corner in square2.corners){
//             if (!square1.corners == square2.corners) shared_edge.push(corner);
//         }
//     }
//     return shared_edge;
// }


// generate_subpolyominoes() {
//     let unwatched = this.get_unwatched_squares();
//     while (unwatched.length > 0) {
//         let squares_connected = this.get_connected_squares(unwatched[0], unwatched);
//         let sub_polyomino = new Polyomino(squares_connected);
//         sub_polyomino.initialize();
//         this.subPolyominoes.push(sub_polyomino);
//         for (let square_used of squares_connected) {
//             let index = unwatched.indexOf(square_used);
//             unwatched.splice(index,1);
//         }
//     }
// }