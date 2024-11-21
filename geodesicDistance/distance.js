function calculateGeodesicDistance(p, q) {
    path = funnelAlgorithm(p, q);
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        distance += sqrt(pow(path[i].x - path[i + 1].x, 2) + pow(path[i].y - path[i + 1].y, 2));
    }
    console.log("Geodesic distance between points: " + distance);
}


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


function funnelAlgorithm(p, q) {
    // Recherche du chemin de triangles
    let trianglePath = findTrianglePath(p, q);
    let diagonals = findDiagonals(trianglePath);

    // Initialisation des variables
    let path = [p];
    let apex = p;
    let leftPath = [p];
    let rightPath = [p];


    // Parcours des diagonales restantes
    for (let i = 0; i < diagonals.length; i++) {
        if (leftPath.length == 1) {
            console.log("DANS LE CAS OU LENGTH = 1")
            // Définir les premiers points du chemin gauche et droit
            if (isCounterClockwise(apex, diagonals[i][0], diagonals[i][1])) {
                let tempB = rightPath.slice();
                console.log(" AVANT rightPath: ", tempB);
                rightPath.push(diagonals[i][0]);
                let tempA = rightPath.slice();
                console.log(" APRES  rightPath: ", tempA);
                diagonals[i][0].color = "red";
                let TempL = leftPath.slice();
                console.log("AVANT leftPath: ", TempL);
                leftPath.push(diagonals[i][1]);
                diagonals[i][1].color = "blue";
                let TempL2 = leftPath.slice();
                console.log(" APRES leftPath: ", TempL2);
            } else {
                let tempB = rightPath.slice();
                console.log(" AVANT rightPath: ", tempB);
                rightPath.push(diagonals[i][1]);
                let tempA = rightPath.slice();
                diagonals[i][1].color = "red";
                console.log(" APRES  rightPath: ", tempA);
                let TempL = leftPath.slice();
                console.log("AVANT leftPath: ", TempL);
                leftPath.push(diagonals[i][0]);    
                diagonals[i][0].color = "blue";
                let TempL2 = leftPath.slice();
                console.log(" APRES leftPath: ", TempL2);
            }
            console.log("END")
        }
        else{  
            console.log("LENGTH PAS EGAL 1")
            let TempL = leftPath.slice();
            console.log("AVANT leftPath: ", TempL);
            let nextPoint = diagonals[i].filter(point => point != leftPath[leftPath.length - 1] && point != rightPath[rightPath.length - 1]);
            console.log("NEXT POINT: ", nextPoint);
            if ((!diagonals[i].includes(leftPath[leftPath.length - 1]))) {
                console.log("RENTRER DANS IF LEFT: ");
                nextPoint.forEach(point => {
                    if (isCounterClockwise(apex, point, leftPath[leftPath.length - 1])) {
                        leftPath.push(point);
                        point.color = "yellow";
                        console.log("AJOUTER UN POUNT point: ", point);
                    } 
                });
            }
            let leftPathTemp = leftPath.slice();
            console.log(" APRES leftPath: ", leftPathTemp);
            let tempB = rightPath.slice();
            console.log(" AVANT rightPath: ", tempB);

            if ((!diagonals[i].includes(rightPath[rightPath.length - 1]))) {
                console.log("RENTRER DANS IF rightPath: ");
                nextPoint.forEach(point => {
                    if (!isCounterClockwise(apex, point, rightPath[rightPath.length - 1])) {
                        rightPath.push(point);
                        point.color = "green";
                        console.log("AJOUTER UN POUNT point: ", point);
                    }});
            }
            let rightPathTemp = rightPath.slice();
            console.log("APRES rightPath: ", rightPathTemp);
            console.log("FIN LEGTH PAS 2GALE 1")
        }
        if (!isCounterClockwise(leftPath[leftPath.length - 1], apex, rightPath[rightPath.length - 1])) {
            console.log("RENTRER DANS IF POUR LAPEX");
            console.log(calculateDet(leftPath[leftPath.length - 1], apex, rightPath[rightPath.length - 1]));
            if(isCounterClockwise(rightPath[rightPath.length - 1], apex, leftPath[leftPath.length - 1])) {
                console.log("CHOISIR LE POINT GAUCHE");
                apex = leftPath[leftPath.length - 1];
                path.push(leftPath[leftPath.length - 1]);
                leftPath = [leftPath[leftPath.length - 1]];
                rightPath = [leftPath[leftPath.length - 1]];
            }
            else{
                console.log("CHOISIR LE POINT DROIT");
                apex = rightPath[rightPath.length - 1];
                path.push(rightPath[rightPath.length - 1]);
                leftPath = [rightPath[rightPath.length - 1]];
                rightPath = [rightPath[rightPath.length - 1]];
            }
        }
    }
    // Ajouter le point d'arrivée au chemin final
    path.push(q);
    return path;
}


