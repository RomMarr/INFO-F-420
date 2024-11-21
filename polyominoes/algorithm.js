function disruptive_solver(polyomino){
    let k = polyomino.get_nb_sub_polyominoes;
    if (k == 0){
        return polyomino.guards;
    }
    else if (k==1){
        let gate = polyomino.subPolyominoes[0].gate
        let alpha = polyomino.calculate_distance_alpha();
        if (alpha == 1){
            // declare G1 to be clockwise
            gate.change_orientation(true);
        } else {
            // declare G1 to be counterclockwise.
            gate.change_orientation(false);
        }
    }

    else if (k == 2){
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

    }

}