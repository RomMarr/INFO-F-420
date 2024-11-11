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