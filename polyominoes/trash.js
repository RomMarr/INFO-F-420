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