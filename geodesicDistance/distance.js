function calculateGeodesicDistance(p, q, ears) {
    path = funnelAlgorithm(p, q, ears);
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        distance += sqrt(pow(path[i].x - path[i + 1].x, 2) + pow(path[i].y - path[i + 1].y, 2));
    }
    console.log("Geodesic distance between points: " + distance);
    return new Distance(p, q, path, distance);
}

function trianglePathFromPoints(p, q, ears) {
    let triangleP = getTriangle(p, ears);
    let triangleQ = getTriangle(q, ears);
    if (!triangleP || !triangleQ) return [];
    return findTrianglePath(triangleP, triangleQ, ears);

}


function findTrianglePath(triangleP, triangleQ, ears) {
    let visited = new Set();
    let queue = [[triangleP]];
    visited.add(triangleP);

    while (queue.length > 0) {
        let path = queue.shift();
        let currentTriangle = path[path.length - 1];

        if (currentTriangle === triangleQ) return path;

        for (let neighbor of getAdjacentTriangles(currentTriangle, ears)) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }
    return [];
}

function isVertex(p, triangle) {
    return triangle.includes(p);
}


function getTriangle(p, ears) {
    for (const ear of ears) {
        if (inTriangle([ear[0], ear[1], ear[2], p]) || isVertex(p, ear)) {
            return ear;
        }
    }
}

function getAdjacentTriangles(triangle, triangles) {
    let neighbors = [];
    for (let other of triangles) {
        if (triangle != other && shareEdge(triangle, other)) {
            neighbors.push(other);
        }
    }
    return neighbors;
}

function shareEdge(triangle1, triangle2) {
    let sharedVertices = triangle1.filter(v => triangle2.includes(v));
    return sharedVertices.length == 2;
}

function findDiagonals(trianglePath) {
    let diagonals = [];
    for (let i = 1; i < trianglePath.length; i++) {
        let triangle1 = trianglePath[i - 1];
        let triangle2 = trianglePath[i];
        let sharedVertices = triangle1.filter(v => triangle2.includes(v));
        if (sharedVertices.length == 2) {
            diagonals.push(sharedVertices);
        }
    }
    return diagonals;
}


function ccw(A, B, C) {
    // Teste si les points A, B, C forment un angle dans le sens antihoraire (ccw)
    return (B.x - A.x) * (C.y - A.y) < (B.y - A.y) * (C.x - A.x);
}



function funnelAlgorithm(p, q, ears) {
    // Recherche du chemin de triangles
    let trianglePath = trianglePathFromPoints(p, q, ears);
    let diagonals = findDiagonals(trianglePath);

    const tail = [p];
    let left = [];
    let right = [];
    let lastEdgeL = null;
    let lastEdgeR = null;

    for (let i = 0; i < diagonals.length; i++) {
        let [p1, p2] = [diagonals[i][0], diagonals[i][1]];

        if (p2 === lastEdgeL || p1 === lastEdgeR || 
            (lastEdgeR === null && lastEdgeL === null && ccw(tail[tail.length - 1], p2, p1))) {
            [p1, p2] = [p2, p1];
        }

        if (left.length === 0 && p1 !== tail[tail.length - 1]) {
            left = [p1];
        } else if (left.length > 0 && left[left.length - 1] !== p1) {
            if (!ccw(tail[tail.length - 1], p1, left[left.length - 1])) {
                let lastCollision = -1;
                for (let j = 0; j < right.length; j++) {
                    if (ccw(tail[tail.length - 1], right[j], p1)) {
                        tail.push(right[j]);
                        lastCollision = j;
                    }
                }
                if (lastCollision >= 0) {
                    left = [p1];
                    right = right.slice(lastCollision + 1);
                } else {
                    left[left.length - 1] = p1;
                }
            } else {
                left.push(p1);
            }
        }

        if (right.length === 0 && p2 !== tail[tail.length - 1]) {
            right = [p2];
        } else if (right.length > 0 && right[right.length - 1] !== p2) {
            if (!ccw(tail[tail.length - 1], right[right.length - 1], p2)) {
                let lastCollision = -1;
                for (let j = 0; j < left.length; j++) {
                    if (ccw(tail[tail.length - 1], p2, left[j])) {
                        tail.push(left[j]);
                        lastCollision = j;
                    }
                }
                if (lastCollision >= 0) {
                    right = [p2];
                    left = left.slice(lastCollision + 1);
                } else {
                    right[right.length - 1] = p2;
                }
            } else {
                right.push(p2);
            }
        }

        lastEdgeL = p1;
        lastEdgeR = p2;
    }

    const apex = tail[tail.length - 1];
    for (let i = 0; i < right.length; i++) {
        if (ccw(apex, right[i], q)) {
            tail.push(right[i]);
        }
    }

    for (let i = 0; i < left.length; i++) {
        if (ccw(apex, q, left[i])) {
            tail.push(left[i]);
        }
    }
    tail.push(q);
    return tail;
}

    