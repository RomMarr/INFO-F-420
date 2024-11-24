// Compute the orientation of the gates by calculing the alpha and beta distances
function compute_gates_orientation(polyomino) {
    let k = polyomino.get_nb_sub_polyominoes();
    if (k == 0){
        return polyomino.guards;
    }
    else if (k==1){
        console.log("k=1");
        let alpha = polyomino.calculate_distance_alpha();
        if (alpha == 1){
            // declare G1 to be clockwise
            polyomino.subPolyominoes[0].gate.change_orientation(true);
        } else {
            // declare G1 to be counterclockwise.
            polyomino.subPolyominoes[0].gate.change_orientation(false);
        }
    }else if (k == 2){
        console.log("k=2");
        let gates = [];
        for (sub of polyomino.subPolyominoes) gates.push(sub.gate)
        let alpha = polyomino.calculate_distance_alpha();
        let beta = polyomino.calculate_distance_beta();
        if (alpha == 1 && beta == 1){
            // declare G1 to be clockwise and G2 to be counterclockwise
            gates[0].change_orientation(true);
            gates[1].change_orientation(false);
        } else if (alpha == 1 && beta > 1){
            // we declare G1 and G2 to be clockwise,
            gates[0].change_orientation(true);
            gates[1].change_orientation(true);
        }else if (alpha > 1 && beta == 1){
            // declare G1 and G2 to be counterclockwise
            gates[0].change_orientation(false);
            gates[1].change_orientation(false);
        }
        else {
            // declare G1 to be counterclockwise and G2 to be clockwise
            gates[0].change_orientation(false);
            gates[1].change_orientation(true);
        }
    }// k >= 3 : all the succesive adjacent gates are clockwise and the rest counterclockwise
    else {
        console.log("k>=3");
        let adjacent = true;
        let indice = 0;
        
        while (indice < k && adjacent){
            // While gates are adjacent, we declare them to be clockwise
            let gate = polyomino.subPolyominoes[indice].gate;
            let nextGate = polyomino.subPolyominoes[(indice + 1) % k].gate;
            for (edge of gate.entry){
                for (nextEdge of nextGate.entry){
                    if (!edge_adjacent(edge, nextEdge)){
                        adjacent = false;
                    }
                }
            }
            gate.change_orientation(true);
            indice += 1;
        }
        // The rest of the gates are counterclockwise
        while (indice < k){
            let gate = polyomino.subPolyominoes[indice].gate;
            gate.change_orientation(false);
            indice += 1;
        }
    }


}

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