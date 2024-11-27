class Distance {
    constructor(origin, end, path, distance) {
        this.origin = origin;
        this.end = end;
        this.path = path;
        this.distance = distance;
        path.length ==2 ? this.isVisible = true : this.isVisible = false;  // if the path is a staight line inside the polygon, two point can see each other
    }
}


// calculates the geodesic distance between two points in a polygon
function calculateGeodesicDistance(p, q, ears) {
    path = funnelAlgorithm(p, q, ears);
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        distance += sqrt(pow(path[i].x - path[i + 1].x, 2) + pow(path[i].y - path[i + 1].y, 2)); // add the distance between each point
    }
    resultMessage = `The geodesic distance between the two points is ${distance}`;
    return new Distance(p, q, path, distance);
}

// search the path of triangles between two points in the polygon
function trianglePathFromPoints(p, q, ears) {
    let triangleP = getTriangle(p, ears);
    let triangleQ = getTriangle(q, ears);
    if (!triangleP || !triangleQ){
        resultMessage = "The points are not inside the polygon";
        return [];
    } 
    return findTrianglePath(triangleP, triangleQ, ears);

}

// bfs to find the path of triangles between two points
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

// check if a point is an extremity of a triangle
function isVertex(p, triangle) {
    return triangle.includes(p);
}

// find the triangle that contains the point
function getTriangle(p, ears) {
    for (const ear of ears) {
        if (inTriangle([ear[0], ear[1], ear[2], p]) || isVertex(p, ear)) {
            return ear;
        }
    }
}


// find neighbors of a triangle
function getAdjacentTriangles(triangle, triangles) {
    let neighbors = [];
    for (let other of triangles) {
        if (triangle != other && shareEdge(triangle, other)) {
            neighbors.push(other);
        }
    }
    return neighbors;
}


// check if two triangles share an edge
function shareEdge(triangle1, triangle2) {
    let sharedVertices = triangle1.filter(v => triangle2.includes(v));
    return sharedVertices.length == 2;
}


// find the diagonals of the path of triangles
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
    // check if the points are in counterclockwise order (left turn)
    return calculateDet(A, B, C) >= 0;
}


// shortest path in a polygon
function funnelAlgorithm(p, q, ears) {
    // find the path of triangles and the diagonals between the two points
    let trianglePath = trianglePathFromPoints(p, q, ears);
    let diagonals = findDiagonals(trianglePath);
    // following code by https://github.com/margaeor/map-shortest-path/blob/master/pathfinder/pathfinder.py
    const path = [p];
    let left = [];
    let right = [];
    let lastEdgeL = null;
    let lastEdgeR = null;

    for (let diagonal of diagonals) {
        let [p1, p2] = [diagonal[0], diagonal[1]];

        if (p2 == lastEdgeL || p1 == lastEdgeR || 
            (lastEdgeR === null && lastEdgeL === null && ccw(path[path.length - 1], p2, p1))) {
            [p1, p2] = [p2, p1];
        }
        // updating the left path
        if (left.length == 0 && p1 != path[path.length - 1]) {
            left = [p1];
        } else if (left.length > 0 && left[left.length - 1] != p1) {
            if (!ccw(path[path.length - 1], p1, left[left.length - 1])) {
                let lastCollision = -1;
                for (let j = 0; j < right.length; j++) {
                    if (ccw(path[path.length - 1], right[j], p1)) {
                        path.push(right[j]);
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
        // updating the right path
        if (right.length === 0 && p2 !== path[path.length - 1]) {
            right = [p2];
        } else if (right.length > 0 && right[right.length - 1] !== p2) {
            if (!ccw(path[path.length - 1], right[right.length - 1], p2)) {
                let lastCollision = -1;
                for (let j = 0; j < left.length; j++) {
                    if (ccw(path[path.length - 1], p2, left[j])) {
                        path.push(left[j]);
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

    const apex = path[path.length - 1];
    for (let i = 0; i < right.length; i++) {
        if (ccw(apex, right[i], q)) {
            path.push(right[i]);
        }
    }

    for (let i = 0; i < left.length; i++) {
        if (ccw(apex, q, left[i])) {
            path.push(left[i]);
        }
    }
    path.push(q);
    return path;
}

    
