// main algorithm to solve the problem of the dispersive art gallery
function disruptiveSolver(polyomino){
    if (computeGatesOrientation(polyomino)) return polyomino.guards;
    for (let sub of polyomino.subPolyominoes){ 
        let guardPos;
        let gate = sub.gate;
        if (gate.areDoorsParallel()){  // gates are parallels
            gate.isParallelEntryHorizontal(); // define if the entry is horizontal or vertical
            let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(gate.giveIntervalEntry());
            guardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,gate);
        }else { // gates are orthogonals
            let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(getLSegment(gate));
            guardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,gate);
        }
        sub.guards.push(new Guard(guardPos)); // add the guard to the subPolyomino
        guards.push(new Guard(guardPos));  // add the guard to list to draw them
        sub.start2(); // start the algorithm to prepare the subPolyomino
        disruptiveSolver(sub); // recursive call to solve the subPolyomino
    }
}