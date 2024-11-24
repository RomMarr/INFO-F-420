function getCommonVertices(squares, vertices){
    console.log("Squares :", squares);
    let commonVertices = [];
    for (let vertex of vertices){
        let flag = false;
        let i = 0;
        while (i < squares.length && !flag){
            if (compare_points(vertex,squares[i].corners[0])||
             compare_points(vertex,squares[i].corners[1]) ||
             compare_points(vertex,squares[i].corners[2]) || 
             compare_points(vertex,squares[i].corners[3])){
                flag = true;
                commonVertices.push(vertex);
             } i++;     
        }
    } return commonVertices;
}

function getUnCommonVertices(vertices, edges) {
    let unCommonVertices = vertices.slice();
    for (let edge of edges) {
        // Remove edge[0] and/or  edge[1] if they exist in unCommonVertices
        unCommonVertices = unCommonVertices.filter(vertex => !compare_points(vertex, edge[0]));
        unCommonVertices = unCommonVertices.filter(vertex => !compare_points(vertex, edge[1]));
    }
    return unCommonVertices;
}

function getMaximalVertices(vertices, increment) {
    let verticesOfMax =[];
    let max = -Infinity;
    let min = Infinity;
    for (vertex of vertices) {
        if (increment.x == 0) {
            if (increment.y < 0){
                if (vertex.y < min) min = vertex.y;
            } else {
                if (vertex.y > max) max = vertex.y;
            }
        }else{
            if (increment.x < 0){
                if (vertex.x < min) min = vertex.x;
            } else {
                if (vertex.x > max) max = vertex.x;
            }

        }
    }
    for (vertex of vertices) {
        if (increment.x == 0) {
            if (increment.y < 0){
                if (vertex.y  == min) verticesOfMax.push(vertex);
            } else {
                if (vertex.y == max) verticesOfMax.push(vertex);
            }
        }else{
            if (increment.x < 0){
                if (vertex.x == min) verticesOfMax.push(vertex);
            } else {
                if (vertex.x == max) verticesOfMax.push(vertex);
            }

        }
    }return verticesOfMax;
}


function calculatePossibleGuardPos(vertices,increment,gate) {
    console.log("on est ici mamem");
    console.log("increment :", increment);
    let possibleGuardPos =[];
    console.log("Intervals :", gate.intervals);
    for (let vertex of vertices) {
        console.log("ici :", vertex);
        if (increment.x == 0) { // if the increment is vertical
            if (increment.y < 0){   // the poliomino is down from the gate
                if (vertex.x < gate.intervals[1].x) possibleGuardPos.push(vertex);
            } else {    // the poliomino is up from the gate
                if (vertex.x > gate.intervals[0].x) possibleGuardPos.push(vertex);
            }
        }else{  // if the increment is horizontal
            if (increment.x < 0){   // if the poliomino is on the left of the gate
                if (vertex.y < gate.intervals[1].y) possibleGuardPos.push(vertex);
            } else {    // if the poliomino is on the right of the gate
                if (vertex.y > gate.intervals[0].y) possibleGuardPos.push(vertex);
            }

        }
}
return possibleGuardPos;}


function getPossibleGuardPos(vertices, rectangle, increment,gate) {
    console.log("Vertices :", vertices);
    let commonVertices = getCommonVertices(rectangle, vertices);
    console.log("CommonVertices :", commonVertices);
    let unCommonVertices = getUnCommonVertices(commonVertices, gate.entry);
    console.log("UncommonVertices :", unCommonVertices);
    let maximalVertices = getMaximalVertices(unCommonVertices, increment);
    console.log("MaximalVertices :", maximalVertices);    
    return calculatePossibleGuardPos(maximalVertices,increment, gate);
}