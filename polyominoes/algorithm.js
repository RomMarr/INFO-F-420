function getCommonVertices(squares, vertices){
    let commonVertices = [];
    for (let vertex of vertices){
        let flag = false;
        let i = 0;
        while (i < squares.length && !flag){
            if (compare_points(vertex,squares[i].corners[0])||
             compare_points(vertex,squares[i].corners[1]) ||
             (compare_points(vertex,squares[i].corners[2]))|| 
             (compare_points(vertex,squares[i].corners[3]))){
                flag = true;
                commonVertices.push(vertex);
             } i++;     
        }
    } return commonVertices;
}

function unCommonVertices(vertices, edges) {
    let unCommonVertices = vertices.slice();
    for (let edge of edges) {
        // Remove edge[0] if it exists in unCommonVertices
        unCommonVertices = unCommonVertices.filter(vertex => !compare_points(vertex, edge[0]));
        // Remove edge[1] if it exists in unCommonVertices
        unCommonVertices = unCommonVertices.filter(vertex => !compare_points(vertex, edge[1]));
    }
    return unCommonVertices;
}

function getMaximalVertices(vertices, increment) {
    let verticesOfMax =[];
    let max = -9999;
    let min = 9999;
    for (vertex of vertices) {
        if (increment[0] == 0) {
            if (increment[1] < 0){
                if (vertex.y < min) min = vertex.y;
            } else {
                if (vertex.y > max) max = vertex.y;
            }
        }else{
            if (increment[1] < 0){
                if (vertex.x < min) min = vertex.x;
            } else {
                if (vertex.x > max) max = vertex.x;
            }

        }
    }
    for (vertex of vertices) {
        if (increment[0] == 0) {
            if (increment[1] < 0){
                if (vertex.y  == min) verticesOfMax.push(vertex);
            } else {
                if (vertex.y == max) verticesOfMax.push(vertex);
            }
        }else{
            if (increment[1] < 0){
                if (vertex.x == min) verticesOfMax.push(vertex);
            } else {
                if (vertex.x == max) verticesOfMax.push(vertex);
            }

        }
    }
}

function calculatePossibleGuardPos(vertices, gate) {
    let possibleGuardPos =[];
    for (let vertex of vertices) {
        if (!commonCoordonate(vertex, gate.intervals))possibleGuardPos.push(vertex);
    } return possibleGuardPos;
}


function getPossibleGuardPos(vertices, rectangle, increment,gate) {
    let commonVertices = getCommonVertices(vertices, rectangle);
    let unCommonVertices = unCommonVertices(commonVertices, gate.entry);
    let maximalVertices = getMaximalVertices(unCommonVertices, increment);
    return calculatePossibleGuardPos(maximalVertices, gate);
}


function disruptive_solver(polyomino){
    compute_gates_orientation(polyomino);
    for (let sub of polyomino.subPolyominoes){
        if (sub.gate.is_parrallel()){ 
            let [rectangleT, increment] = sub.gate.biggestRectangleAdjacentToGate();
            let possibleGuardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,sub.gate)
            sub.guards = possibleGuardPos[0];
            sub.start();
            disruptive_solver(sub);
        }else { // gates are orthogonals 
            if (!sub.gate.orientation){ // gate is counter-clockwise

            } else { // gate is clockwise

            }
        }
    }
}


    function compute_gates_orientation(polyomino) {
        // Compute the orientation of the gates using the following rules:
        let k = polyomino.get_nb_sub_polyominoes();
        
        if (k == 0){
            return polyomino.guards;
        }
        
        else if (k==1){
            console.log("k=1");
            let gate = polyomino.subPolyominoes[0].gate
            let alpha = polyomino.calculate_distance_alpha();
            if (alpha == 1){
                // declare G1 to be clockwise
                polyomino.subPolyominoes[0].gate.change_orientation(true);
            } else {
                // declare G1 to be counterclockwise.
                polyomino.subPolyominoes[0].gate.change_orientation(false);
            }
        }
    
        else if (k == 2){
            console.log("k=2");
            let gates = [];
            for (sub of polyomino.subPolyominoes) gates.push(sub.gate)
            let alpha = polyomino.calculate_distance_alpha();
            let beta = polyomino.calculate_distance_beta();
            console.log("alpha", alpha);
            console.log("beta", beta);
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
            console.log("k>2");
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