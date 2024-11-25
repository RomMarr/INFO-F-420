function l1geodesicDistance(p1, p2, polyomino) {
    let path = bfsL1GeodesicDistance(p1, p2, polyomino);
    let distance = path.length;
}


function bfsL1GeodesicDistance(p1, p2, polyomino) {
    const squares = polyomino.getSquares();
    const squareP1 = squares[polyomino.getSquareIndexAtPoint(p1)];
    const squareP2 = squares[polyomino.getSquareIndexAtPoint(p2)];

    const queue = [];
    const visited = new Set();

    // Initial Point
    queue.push({s: squareP1, path :[]});
    visited.add(squareP1);

    while (queue.length > 0) {
        const {s, path} = queue.shift();

        if (s === squareP2) {
            return path;
        }

        const neighbors = polyomino.getDirectNeighbors(s, squares);

        // Ajouter les voisins non visités à la file
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ s: neighbor, path: path.push(neighbor) });
            }
        }
    }

    return [];
}


