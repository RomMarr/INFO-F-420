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

 // get_vertical(){
    //     this.isHorizontal = false;
    //     let vertical = [];
    //     let x;
    //     for (let edge of this.doors){
    //         if (edge[0].x == edge[1].x) {
    //             vertical.push(edge);
    //             x = edge[0].x;
    //         }
    //     }
    //     let min = 9999;
    //     let max = -9999;
    //     for (edge of vertical){
    //         if (edge[0].y < min) min = edge[0].y;
    //         if (edge[0].y > max) max = edge[0].y;
    //         if (edge[1].y > max) max = edge[1].y;
    //         if (edge[1].y < min) min = edge[1].y;

    //     }
    //     this.intervals = [new Point(min,x), new Point(max, x)];
    //     return [min,max,x];
    // }

    // get_horizontal(){
    //     this.isHorizontal = true;
    //     let horizontal = [];
    //     let y;
    //     for (let edge of this.doors){
    //         if (edge[0].y == edge[1].y) {
    //             y= edge[0].y;
    //             horizontal.push(edge); }
    //     }
    //     let min = 9999;
    //     let max = -9999;
    //     for (edge of horizontal){
    //         if (edge[0].x > max) max = edge[0].x;
    //         if (edge[0].x < min) min = edge[0].x;
    //         if (edge[1].x > max) max = edge[1].x;
    //         if (edge[1].x < min) min = edge[1].x;
    //     }
    //     this.intervals = [new Point(min,y), new Point(max, y)];
    //     return [min,max,y];
    // }

    // function getMaximalVertices(vertices, increment) {
//     let verticesOfMax =[];
//     let max = -Infinity;
//     let min = Infinity;
//     for (vertex of vertices) {
//         if (increment[0] == 0) {
//             if (increment[1] < 0){
//                 if (vertex.y < min) min = vertex.y;
//             } else {
//                 if (vertex.y > max) max = vertex.y;
//             }
//         }else{
//             if (increment[1] < 0){
//                 if (vertex.x < min) min = vertex.x;
//             } else {
//                 if (vertex.x > max) max = vertex.x;
//             }

//         }
//     }
//     for (vertex of vertices) {
//         if (increment[0] == 0) {
//             if (increment[1] < 0){
//                 if (vertex.y  == min) verticesOfMax.push(vertex);
//             } else {
//                 if (vertex.y == max) verticesOfMax.push(vertex);
//             }
//         }else{
//             if (increment[1] < 0){
//                 if (vertex.x == min) verticesOfMax.push(vertex);
//             } else {
//                 if (vertex.x == max) verticesOfMax.push(vertex);
//             }

//         }
//     }
// }
// function getMaximalVertices(vertices, increment) {
//     let verticesOfMax = [];
//     let targetValue = increment[1] < 0 ? Infinity : -Infinity;
//     let isVertical = increment[0] === 0;
//     for (let vertex of vertices) { // calculate min and max
//         let value = isVertical ? vertex.y : vertex.x;
//         if (increment[1] < 0) {
//             if (value < targetValue) targetValue = value;
//         } else {
//             if (value > targetValue) targetValue = value;
//         }
//     }
//     for (let vertex of vertices) { // Collect vertices matching the target value
//         let value = isVertical ? vertex.y : vertex.x;
//         if (value === targetValue) verticesOfMax.push(vertex);
//     }

//     return verticesOfMax;
// }



    // get_intervals() {
    //     let isHorizontal = this.isHorizontal;
    //     let edges = [];
    //     let constantValue;
    
    //     // Determine if we're looking for horizontal or vertical edges
    //     for (let edge of this.doors) {
    //         if ((isHorizontal && edge[0].y === edge[1].y) || (!isHorizontal && edge[0].x === edge[1].x)) {
    //             constantValue = isHorizontal ? edge[0].y : edge[0].x;
    //             edges.push(edge);
    //         }
    //     }
    //     let min = Infinity;
    //     let max = -Infinity;
    //     // Find the min and max based on the variable axis
    //     for (let edge of edges) {
    //         const coord0 = isHorizontal ? edge[0].x : edge[0].y;
    //         const coord1 = isHorizontal ? edge[1].x : edge[1].y;
    //         if (coord0 < min) min = coord0;
    //         if (coord0 > max) max = coord0;
    //         if (coord1 < min) min = coord1;
    //         if (coord1 > max) max = coord1;
    //     }
    //     this.intervals = isHorizontal 
    //         ? [new Point(min, constantValue), new Point(max, constantValue)]
    //         : [new Point(constantValue, min), new Point(constantValue, max)];
    
    //     return [min, max, constantValue];
    // }

    // getPoint(incr){
    //     if (this.isHorizontal){
    //         if (incr.y < 0) {
    //             for (let edge of this.entry){
    //                 if (edge[0].y == this.intervals[0].y) return edge[0];
    //             }
    //         }
    //     }
    // }

    // function calculatePossibleGuardPos(vertices,increment,gate) {
    //     let possibleGuardPos =[];
    //     for (let vertex of vertices) {
    
    //         if (increment.x == 0) { // if the increment is vertical
    //             if (increment.y < 0){   // the poliomino is down from the gate
    //                 if (vertex.x < gate.intervals[1].x) possibleGuardPos.push(vertex);
    //             } else {    // the poliomino is up from the gate
    //                 if (vertex.x > gate.intervals[0].x) possibleGuardPos.push(vertex);
    //             }
    //         }else{  // if the increment is horizontal
    //             if (increment.x < 0){   // if the poliomino is on the left of the gate
    //                 if (vertex.y < gate.intervals[1].y) possibleGuardPos.push(vertex);
    //             } else {    // if the poliomino is on the right of the gate
    //                 if (vertex.y > gate.intervals[0].y) possibleGuardPos.push(vertex);
    //             }
    
    //         }
    // }
    // return possibleGuardPos;
    // }
    
    // function getEndPoint(subPolyomino, gate){
//     if (gate.needsEndPoint()){
//         endPoint = subPolyomino.calculateEndPoint();
//         return endPoint;
//     } return null;
// }

// calculateEndPoint(){
//     let gate = this.gate;
//     let direction;
//     let current;
//     if (gate.needsEndPoint()){
//         if (gate.verticalEntries.length >=1){
//             let [min, max] = getMinMaxY(gate.verticalEntries);
//             for (let door of gate.doors){
//                 if (!(door[0].x == door[1].x)){
//                     if (min == door[0].y){
//                         direction = new Point(0,-this.size);
//                         current = new Point(door[0].x, min);
//                     }else {
//                         direction = new Point(0,this.size);
//                         current = new Point(door[0].x, max);
//                     }   
//                 }
//             }
//         }else {
//             let [min, max] = getMinMaxY(gate.verticalEntries);
//             for (let door of gate.doors){
//                 if (!(door[0].y == door[1].y)){
//                     if (min == door[0].x){
//                         direction = new Point(0,-this.size);
//                         current = new Point(min, door[0].y);
//                     }else {
//                         direction = new Point(0,this.size);
//                         current = new Point(max, door[0].y);
//                     }   
//                 }
//             }
//         }
//         let previous;
//         while (this.getSquareIndexAtPoint(current) != -1){
//             previous = current;
//             current = additionPoints(current, direction);
//         }return previous;
//     }return null;
// }

// function getMinMaxX(listEdges){
//   let min = Infinity;
//   let max = -Infinity;
//   for (let edge of listEdges){
//     for (let point of edge){
//       if (point.x < min) min = point.x;
//       if (point.x > max) max = point.x;
//     }
//   } return [min,max];
// }

// function getMinMaxY(listEdges){
//   let min = Infinity;
//   let max = -Infinity;
//   for (let edge of listEdges){
//     for (let point of edge){
//       if (point.y < min) min = point.y;
//       if (point.y > max) max = point.y;
//     }
//   } return [min,max];
// }
// var RightTurn = "Right Turn";
// var Straight = "Straight";
// var LeftTurn = "Left Turn";

// // Calculate the determinant of the 3 points
// function calculateDet(p1, p2, p3) {
//   const det =
//     p1.x * p2.y -
//     p1.x * p3.y -
//     p1.y * p2.x +
//     p1.y * p3.x +
//     p2.x * p3.y -
//     p2.y * p3.x;
//   return -det; // -det because the Y-axis is inverted
// }

// // This determine the orientation from the determinant
// function orient(p1, p2, p3) {
//   const det = calculateDet(p1, p2, p3);
//   if (det < 0) return RightTurn;
//   else if (det > 0) return LeftTurn;
//   else return Straight;
// }

// // Check if 4th point is in the triangle of the 3 other points
// function isInTriangle(p1, p2, p3, p4) {
//   const orient1 = orient(p1, p2, p4);
//   const orient2 = orient(p2, p3, p4);
//   const orient3 = orient(p3, p1, p4);

//   if (orient1 == orient2 && orient1 == orient3 && orient1 != Straight) {
//     return true;
//   }
//   if (orient1 == Straight) {
//     return isInTriangleLine(p1, p2, p4);
//   }
//   if (orient2 == Straight) {
//     return isInTriangleLine(p2, p3, p4);
//   }
//   if (orient3 == Straight) {
//     return isInTriangleLine(p3, p1, p4);
//   }
//   return false;
// }

// // check if p3 is on the segment {p1, p2} or further than one of those points
// function isInTriangleLine(p1, p2, p3) {
//   const maxX = Math.max(p1.x, p2.x);
//   const maxY = Math.max(p1.y, p2.y);
//   const minX = Math.min(p1.x, p2.x);
//   const minY = Math.min(p1.y, p2.y);
//   if (p3.x > maxX || p3.x < minX || p3.y > maxY || p3.y < minY) {
//     return false;
//   }
//   return true;
// }

// // Check collision between segment a,b and segment c,d
// function checkDetCollision(a, b, c, d) {
//   let det1 = calculateDet(a, b, c);
//   let det2 = calculateDet(a, b, d);
//   let det3 = calculateDet(c, d, a);
//   let det4 = calculateDet(c, d, b);
//   if (det1 * det2 < 0 && det3 * det4 < 0) return true;
//   return false;
// }

// // Handle the collison check for all the edges together
// function checkCollision() {
//   let edges = getEdges(polygon);
//   for (let i = 0; i < edges.length; i++) {
//     for (let j = 0; j < edges.length; j++) {
//       // if not same edge
//       if (i !== j) {
//         // if they don't have the sames vertices
//         if (!compareEdges(edges[i], edges[j])) {
//           if (
//             checkDetCollision(
//               edges[i][0],
//               edges[i][1],
//               edges[j][0],
//               edges[j][1]
//             )
//           ) {
//             return true;
//           }
//         }
//       }
//     }
//   }
//   return false;
// }

// // Create a list of edges from the points
// function getEdges(polygon) {
//   const edges = [];
//   for (let i = 0; i < polygon.length; i++) {
//     const point1 = polygon[i];
//     const point2 = polygon[(i + 1) % polygon.length];
//     edges.push([point1, point2]);
//   }
//   return edges;
// }

// Function to start the subPolyomino and generate its information (first guard is not applicable here)
    // start2(){
    //     this.orderBoundariesFromGuard();
    //     this.r_visibility(this.guards[0]);
    //     this.generate_subpolyominoes();
    //     this.generate_gates();
    //     this.toDraw();
    // }