function disruptive_solver(polyomino){
    console.log("on ets ici");
    compute_gates_orientation(polyomino);
    for (let sub of polyomino.subPolyominoes){
        console.log("Sub : ",sub);
        let gate = sub.gate;
        if (gate.is_parrallel()){ 
            gate.isEntryHorizontal();
            let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(gate.giveIntervalEntry());
            let possibleGuardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,sub.gate)
            console.log("PossibleGuardPos :", possibleGuardPos);
            sub.guards.push( new Guard(possibleGuardPos[0]));
            guards.push(new Guard(possibleGuardPos[0]));
            //sub.start2();
            console.log("disruptive_solver(sub)");
        }else { // gates are orthogonals 
            let guardOfSub;
            if (!sub.gate.orientation){ // gate is counter-clockwise
                gate.ishorizontal = false;
                if (gate.getVertical()[2] == null) { 
                    console.log("gate Vertical == null");
                    let guardPos;
                    let startPoint = gate.entry[0][0];
                    let flag = true;
                    while (flag){
                        startPoint = new Point(startPoint.x + sub.size, startPoint.y);
                        if (!is_point_in_edges(startPoint, gate.entry)){
                            if (sub.vertices.includes(startPoint)){
                                guardPos = startPoint;
                            }
                            else(flag = false);
                        }
                    }
                    if (guardPos == null){
                        while (flag){
                            startPoint = new Point(startPoint.x - sub.size, startPoint.y);
                            if (!is_point_in_edges(startPoint, gate.entry)){
                                if (sub.vertices.includes(startPoint)){
                                    guardPos = startPoint;
                                }
                            else(flag = false);
                            }
                        }

                    }
                    if (guardPos == null){
                        guardPos = gate.entry[0][0];
                    }
                guardOfSub = new Guard(guardPos);
                }
                else {
                let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(gate.getVertical());
                console.log("RectangleT :", rectangleT, "Increment :", increment);
                let possibleGuardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,sub.gate)
                console.log("PossibleGuardPos :", possibleGuardPos);
                guardOfSub = new Guard(possibleGuardPos[0]);
                }
            } else { // gate is clockwise
                gate.ishorizontal = true;
                if (gate.getHorizontal()[2] == null) { 
                    console.log("gate hoeizer == null");
                    let guardPos;
                    let startPoint = gate.entry[0][0];
                    let flag = true;
                    while (flag){
                        startPoint = new Point(startPoint.x, startPoint.y + sub.size);
                        if (!is_point_in_edges(startPoint, gate.entry)){
                            if (sub.vertices.includes(startPoint)){
                                guardPos = startPoint;
                        }
                            else(flag = false);
                    }
                }
                    if (guardPos == null){
                        let startPoint = gate.entry[0][0];
                        while (flag){
                            startPoint = new Point(startPoint.x, startPoint.y - sub.size);
                            if (!is_point_in_edges(startPoint, gate.entry)){
                                if (sub.vertices.includes(startPoint)){
                                    guardPos = startPoint;
                                }
                            else(flag = false);
                            }
                        }

                    }
                    if (guardPos == null){
                        guardPos = gate.entry[0][0];
                    }
                    guardOfSub = new Guard(guardPos);
                }
                else {
                let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(gate.getHorizontal());
                console.log("RectangleT :", rectangleT, "Increment :", increment);
                let possibleGuardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,sub.gate)
                console.log("PossibleGuardPos :", possibleGuardPos);
                guardOfSub = new Guard(possibleGuardPos[0]);
                }

            }
            console.log("Guard of sub :", guardOfSub);
            sub.guards.push( guardOfSub);
            guards.push(guardOfSub);
            //sub.start2();
            console.log("disruptive_solver(sub)");
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