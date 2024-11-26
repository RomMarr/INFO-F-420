// Compute the orientation of the gates by calculing the alpha and beta distances
function computeGatesOrientation(polyomino) {
    let k = polyomino.getNbSubPolyominoes();
    if (k == 0) return true;
    else if (k==1){
        let alpha = polyomino.calculateDistanceAlpha();
        if (alpha == 1)polyomino.subPolyominoes[0].gate.changeOrientation(true); // declare G1 to be clockwise
        else polyomino.subPolyominoes[0].gate.changeOrientation(false); // declare G1 to be counterclockwise.
    }else if (k == 2){
        let gates = [];
        for (sub of polyomino.subPolyominoes) gates.push(sub.gate) // get the gates of the subpolyominoes
        let alpha = polyomino.calculateDistanceAlpha();
        let beta = polyomino.calculateDistanceBeta();
        if (alpha == 1 && beta == 1){
            // declare G1 to be clockwise and G2 to be counterclockwise
            gates[0].changeOrientation(true);
            gates[1].changeOrientation(false);
        } else if (alpha == 1 && beta > 1){
            // we declare G1 and G2 to be clockwise,
            gates[0].changeOrientation(true);
            gates[1].changeOrientation(true);
        }else if (alpha > 1 && beta == 1){
            // declare G1 and G2 to be counterclockwise
            gates[0].changeOrientation(false);
            gates[1].changeOrientation(false);
        }
        else {
            // declare G1 to be counterclockwise and G2 to be clockwise
            gates[0].changeOrientation(false);
            gates[1].changeOrientation(true);
        }
    }// k >= 3 : all the succesive adjacent gates are clockwise and the rest counterclockwise
    else {
        let adjacent = true;
        let indice = 0;
        while (indice < k && adjacent){
            // While gates are adjacent, we declare them to be clockwise
            let gate = polyomino.subPolyominoes[indice].gate;
            let nextGate = polyomino.subPolyominoes[(indice + 1) % k].gate;
            for (edge of gate.entry){
                for (nextEdge of nextGate.entry){
                    if (!edgeAdjacent(edge, nextEdge)){
                        adjacent = false;
                    }
                }
            }
            gate.changeOrientation(true);
            indice += 1;
        }
        // The rest of the gates are counterclockwise
        while (indice < k){
            let gate = polyomino.subPolyominoes[indice].gate;
            gate.changeOrientation(false);
            indice += 1;
        }
    }return false;
}

// Compare the corners of the squares of the polyomino and the boundaries of the rectangleT and returns the one that are in both
function getCommonVertices(squares, vertices){
    let commonVertices = [];
    for (let vertex of vertices){
        let flag = false;
        let i = 0;
        while (i < squares.length && !flag){ // Check for each vertex with each square's corners 
            if (comparePoints(vertex,squares[i].corners[0])||
            comparePoints(vertex,squares[i].corners[1]) ||
             comparePoints(vertex,squares[i].corners[2]) || 
             comparePoints(vertex,squares[i].corners[3])){
                flag = true;
                commonVertices.push(vertex);
             } i++;     
        }
    } return commonVertices;
}
// Remove the edges in both the entry and the vertices
function getUnCommonVertices(vertices, edges) {
    let unCommonVertices = vertices.slice();
    for (let edge of edges) {
        // Remove edge[0] and/or  edge[1] if they exist in unCommonVertices
        unCommonVertices = unCommonVertices.filter(vertex => !comparePoints(vertex, edge[0]));
        unCommonVertices = unCommonVertices.filter(vertex => !comparePoints(vertex, edge[1]));
    }
    return unCommonVertices;
}

// function to check if there is a position to place a guard in a parallel gate
function findGuardParallel(unCommonVertices, rectangleT, increment, gate) {
    let entry = gate.entry;
    let isClockwise = gate.orientation;

    // Calculate boundaries of rectangleT
    const bottom = Math.min(...rectangleT.map(square => square.y));
    const top = Math.max(...rectangleT.map(square => square.y + square.size));
    const left = Math.min(...rectangleT.map(square => square.x));
    const right = Math.max(...rectangleT.map(square => square.x + square.size));
    // Adjust boundaries based on the increment direction
    let g = null;

    // Determine the entry's orientation (horizontal or vertical entry)
    let isHorizontal = gate.isParallelEntryHorizontal();
    if (isHorizontal) {
        if (increment.y < 0) {
            // Moving left, so reverse the comparison for x
            g = unCommonVertices.find(vertex =>
                !isPointInEdges(vertex, entry) && // Ensure the vertex is not on entry
                (isClockwise ? vertex.x > left : vertex.x < right)
            );
        } else {
            // Moving right, so we check the normal comparison for x
            g = unCommonVertices.find(vertex =>
                !isPointInEdges(vertex, entry) && // Ensure the vertex is not on the entry
                (isClockwise ? vertex.x < right : vertex.x > left)
            );
        }
    } else { // If the entry is vertical
        if (increment.x < 0) {
            // Moving downward, reverse the comparison for y 
            g = unCommonVertices.find(vertex =>
                !isPointInEdges(vertex, entry) && 
                (isClockwise ? vertex.y < top : vertex.y > bottom)
            );
        } else {
            // Moving upward, check the normal comparison for y
            g = unCommonVertices.find(vertex =>
                !isPointInEdges(vertex, entry) && 
                (isClockwise ? vertex.y > bottom : vertex.y < top)
            );
        }
    }
    // If no valid guard is found, throw an error
    if (!g) {
        throw new Error("No valid guard found!");
    } return g;
}

// Get the maximal (top) vertices of a rectangle
function getMaximalVertices(vertices, increment) {
    let verticesOfMax =[];
    let max = -Infinity;
    let min = Infinity;
    for (vertex of vertices) {
        if (increment.x == 0) { // if the increment is vertical
            if (increment.y < 0){ // if the increment go up (in the P5 canvas)
                if (vertex.y < min) min = vertex.y;
            } else { // if the increment go down (in the P5 canvas)
                if (vertex.y > max) max = vertex.y;
            }
        }else{ // if the increment is horizontal
            if (increment.x < 0){ // if the increment go left 
                if (vertex.x < min) min = vertex.x;
            } else { // if the increment go right
                if (vertex.x > max) max = vertex.x;
            }
        }
    }for (vertex of vertices) {
        if (increment.x == 0) { // if the increment is vertical
            if (increment.y < 0){ // if the increment go up (in the P5 canvas)
                if (vertex.y  == min) verticesOfMax.push(vertex);
            } else { // if the increment go down (in the P5 canvas)
                if (vertex.y == max) verticesOfMax.push(vertex);
            }
        }else{ // if the increment is horizontal
            if (increment.x < 0){ // if the increment go left
                if (vertex.x == min) verticesOfMax.push(vertex);
            } else { // if the increment go right
                if (vertex.x == max) verticesOfMax.push(vertex);
            }
        }
    }return verticesOfMax;  // return the vertices at the top of rectangle T (based on the orientation)
}

// Get the possible guard position for a any gate
function getPossibleGuardPos(vertices, rectangleT, increment,gate) {
    // get the common vertices between the rectangle and the vertices
    let commonVertices = getCommonVertices(rectangleT, vertices); 
    // remove the vertices on the entry from the common vertices 
    let unCommonVertices = getUnCommonVertices(commonVertices, gate.entry);
    // get the top of the rectangleT
    let maximalVertices = getMaximalVertices(unCommonVertices, increment);
    // find the guard position
    let g = findGuardParallel(maximalVertices, rectangleT,increment, gate);
    return g;
}

// Get the L segment of an orthogonal gate (vertical or horizontal)
function getLSegment(gate){
    gate.isHorizontal = gate.orientation; // check the orientation of the gate
    if (gate.needsEndPoint()){ // if the gate needs an endpoint we change the orientation to adapt for it
        gate.isHorizontal = !gate.orientation;
    } // return the entries (L segment) of the gate
    if (gate.isHorizontal) return gate.getHorizontal(); 
    else return gate.getVertical();
}