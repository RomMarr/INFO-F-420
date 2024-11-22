function disruptive_solver(polyomino){
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
    }// k >= 3 : 
    else {
        console.log("k>2");
        let adjacent = true;
        let indice = 0;
        while (indice < k && adjacent){
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
        while (indice < k){
            let gate = polyomino.subPolyominoes[indice].gate;
            gate.change_orientation(false);
            indice += 1;
        }
    }

}