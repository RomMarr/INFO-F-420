function l1geodesicDistance(p1, p2) {
    let path = findPath(p1, p2);
    distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        distance = distance + Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
    }
    return distance;
}


function findPath(p1, p2){

}

function bfs_l1_distance(startSquare, targetSquare, squares) {
    const queue = [];
    const visited = new Set();

    // Initialiser la file avec le point de départ
    queue.push({ square: startSquare, distance: 0 });
    visited.add(`${startSquare.x},${startSquare.y}`);

    while (queue.length > 0) {
        const current = queue.shift();
        const { square, distance } = current;

        // Vérifier si on a atteint la cible
        if (square === targetSquare) {
            return distance; // Distance L1 calculée
        }

        // Obtenir les voisins directs
        const neighbors = this.getDirectNeighbors(square, squares);

        // Ajouter les voisins non visités à la file
        for (let neighbor of neighbors) {
            const neighborKey = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(neighborKey)) {
                visited.add(neighborKey);
                queue.push({ square: neighbor, distance: distance + 1 });
            }
        }
    }

    // Si aucune connexion n'est trouvée
    return -1;
}
