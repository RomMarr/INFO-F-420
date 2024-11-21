function findTrianglePath(p, q) {
    let triangleP = getTriangle(p);
    let triangleQ = getTriangle(q);

    if (!triangleP || !triangleQ) return [];

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


function getTriangle(p) {
    for (const ear of ears) {
        if (inTriangle([ear[0], ear[1], ear[2], p])) {
            return ear;
        }
    }
}

function getAdjacentTriangles(triangle, triangles) {
    let neighbors = [];
    for (let other of triangles) {
        if (triangle !== other && shareEdge(triangle, other)) {
            neighbors.push(other);
        }
    }
    return neighbors;
}

function shareEdge(triangle1, triangle2) {
    let sharedVertices = triangle1.filter(v => triangle2.includes(v));
    return sharedVertices.length === 2;
}

function funnelAlgorithmWithTriangulation(p, q) {
    ensureCounterClockWise(points);
    triangulate(points);

    const trianglePath = findTrianglePath(p, q);

    let apexIndex = 0;
    let leftPath = [p];
    let rightPath = [p];
    let path = [p];

    for (let i = 0; i < trianglePath.length; i++) {
        let [v1, v2, v3] = trianglePath[i];
        let trianglePoints = [v1, v2, v3];

        for (let currentPoint of trianglePoints) {
            if (calculateDet(path[apexIndex], leftPath[leftPath.length - 1], currentPoint) <= 0) {
                leftPath.push(currentPoint);
                if (calculateDet(path[apexIndex], rightPath[rightPath.length - 1], currentPoint) > 0) {
                    path.push(currentPoint);
                    apexIndex = path.length - 1;
                    leftPath = [currentPoint];
                    rightPath = [currentPoint];
                }
            }
            if (calculateDet(path[apexIndex], rightPath[rightPath.length - 1], currentPoint) >= 0) {
                rightPath.push(currentPoint);
                if (calculateDet(path[apexIndex], leftPath[leftPath.length - 1], currentPoint) < 0) {
                    path.push(currentPoint);
                    apexIndex = path.length - 1;
                    leftPath = [currentPoint];
                    rightPath = [currentPoint];
                }
            }
        }
    }

    path.push(end);
    return path;
}