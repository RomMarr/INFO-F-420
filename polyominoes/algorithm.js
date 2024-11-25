function disruptive_solver(polyomino){
    if (compute_gates_orientation(polyomino)) return polyomino.guards;
    for (let sub of polyomino.subPolyominoes){
        console.log("Sub : ",sub);
        let gate = sub.gate;
        if (gate.are_doors_parallel()){ 
            console.log("gate are parallel");
            gate.is_parallel_entry_horizontal(); // define if the entry is horizontal or vertical
            let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(gate.giveIntervalEntry());
            let guardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,gate);
            sub.guards.push( new Guard(guardPos));
            guards.push(new Guard(guardPos));
            sub.start2();
            disruptive_solver(sub);
        }else { // gates are orthogonals
            console.log("gate are parallel");
            let guardPos = getEndPoint(sub, gate);
            if (guardPos == null){
                let [rectangleT, increment] = sub.biggestRectangleAdjacentToGate(getLSegment(gate));
                guardPos = getPossibleGuardPos(sub.vertices, rectangleT, increment,gate);
            }            
            sub.guards.push( new Guard(guardPos));
            guards.push(new Guard(guardPos));
            //sub.start2();
            //disruptive_solver(sub);

        }
        //sub.guards.push( new Guard(guardPos));
        // guards.push(new Guard(guardPos));
        // sub.start2();
        // disruptive_solver(sub);
    }
}

/**
 *  // gates are orthogonals 
            console.log("gate are orthogonals");
            let guardOfSub;
            if (!sub.gate.orientation){ // gate is counter-clockwise
                gate.ishorizontal = false;
                if (gate.getVertical()[2] == null) { 
                    //console.log("gate Vertical == null");
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
        
 */