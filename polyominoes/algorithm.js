function disruptive_solver(polyomino){
    compute_gates_orientation(polyomino);
    for (let sub of polyomino.subPolyominoes){
        console.log("Sub : ",sub);
        let gate = sub.gate;
        if (gate.are_doors_parallel()){ 
            gate.is_parallel_entry_horizontal(); // define if the entry is horizontal or vertical
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
                            else flag = false;
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

