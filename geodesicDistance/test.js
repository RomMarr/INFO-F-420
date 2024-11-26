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
            console.log("IAGONALS: ", diagonals[i]);
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
            if(                                                                                                                                                                                                                                                       isCounterClockwise(rightPath[rightPath.length - 1], apex, leftPath[leftPath.length - 1])) {
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


function funnelAlgorithm(p, q) {
    // Recherche du chemin de triangles
    let trianglePath = findTrianglePath(p, q);
    console.log("TRIANGLE PATH: ", trianglePath);
    let diagonals = findDiagonals(trianglePath);
    console.log("DIAGONALS: ", diagonals);

    // Initialisation des variables
    let path = [p];
    let apex = p;
    let leftPath = [p];
    let rightPath = [p];
    let lastAddedTo = null;

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
            console.log("IAGONALS: ", diagonals[i]);
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
                        lastAddedTo = "leftPath";
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
                        lastAddedTo = "rightPath";
                        console.log("AJOUTER UN POUNT point: ", point);
                    }});
            }
            let rightPathTemp = rightPath.slice();
            console.log("APRES rightPath: ", rightPathTemp);
            console.log("FIN LEGTH PAS 2GALE 1")
        }
        if (!isCounterClockwise(leftPath[leftPath.length - 1], apex, rightPath[rightPath.length - 1])) {
            if (lastAddedTo == "rightPath") {
                apex = leftPath[leftPath.length - 1];
            } else {
                apex = rightPath[rightPath.length - 1];
            }
            path.push(apex);
            leftPath = [apex];
            rightPath = [apex];
        }
    }
    // Ajouter le point d'arrivée au chemin final
    path.push(q);
    return path;
}


class Node {
    constructor(triangle, neighbors = []) {
        this.triangle = triangle; // Le triangle représenté par ce nœud
        this.neighbors = neighbors; // Les triangles adjacents
    }
}

class Edge {
    constructor(triangle1, triangle2) {
        this.edge = [triangle1, triangle2]; // Connexion entre deux triangles
    }
}

class DualGraph {
    constructor(triangles) {
        this.vertices = [];
        this.edges = [];
        this.constructGraph(triangles); // Initialisation du graphe
    }

    constructGraph(triangles) {
        for (let triangle of triangles) {
            let neighbors = getAdjacentTriangles(triangle, triangles); // Méthode pour trouver les voisins
            let node = new Node(triangle, neighbors);
            this.vertices.push(node);

            // Ajouter les arêtes du graphe
            neighbors.forEach(neighbor => {
                this.edges.push(new Edge(triangle, neighbor));
            });
        }
    }

    findLeaf() {
        // Retourne deux feuilles (nœuds ayant un seul voisin)
        let leaves = [];
        for (let node of this.vertices) {
            if (node.neighbors.length === 1) {
                leaves.push(node);
            }
        }
        if (leaves.length < 2) {
            throw new Error("Le graphe ne contient pas assez de feuilles.");
        }
        return [leaves[0], leaves[1]];
    }
}

function findTrianglePath(leaf1, leaf2) {
    // Méthode pour trouver un chemin entre deux feuilles dans un graphe dual
    let visited = new Set();
    let stack = [leaf1];
    let path = [];

    while (stack.length > 0) {
        let current = stack.pop();
        if (current === leaf2) {
            path.push(current);
            break;
        }
        if (!visited.has(current)) {
            visited.add(current);
            path.push(current);
            for (let neighbor of current.neighbors) {
                if (!visited.has(neighbor)) {
                    stack.push(neighbor);
                }
            }
        }
    }
    return path;
}

function placeGuards(trianglePath) {
    let guards = [];
    let placedGuards = new Set();

    for (let node of trianglePath) {
        let triangle = node.triangle;

        // Placer un garde sur un sommet visible non encore utilisé
        for (let vertex of triangle) {
            if (!isVertexTooClose(vertex, placedGuards)) {
                guards.push(vertex);
                placedGuards.add(vertex);
                break;
            }
        }
    }

    return guards;
}

function isVertexTooClose(vertex, placedGuards) {
    // Vérifie si un sommet est à moins de 2 unités géodésiques des gardes placés
    for (let guard of placedGuards) {
        if (calculateGeodesicDistance(vertex, guard) < 2) {
            return true;
        }
    }
    return false;
}

function solveDAGP(polygon) {
    if (checkCollision()) {
        return "COLLISION: veuillez fournir un polygone simple.";
    } else {
        createPolygon = true;

        let pts = polygon.slice(); // Copie des points
        pts = ensureCounterClockWise(pts); // Vérification de l'ordre anti-horaire

        // Vérification de la distance géodésique entre les sommets
        if (!checkGeodesicDistance(pts)) {
            return "Échec: les sommets du polygone doivent être séparés par au moins 1 unité géodésique.";
        }

        // Triangulation
        let ears = triangulate(pts); // Calcul de la triangulation
        let dualGraph = new DualGraph(ears);

        // Recherche des feuilles
        let [leaf1, leaf2] = dualGraph.findLeaf();

        // Construction du chemin entre les feuilles
        let trianglePath = findTrianglePath(leaf1, leaf2);

        // Placement des gardes
        let guards = placeGuards(trianglePath);

        // Retour des gardes placés
        return {
            guards,
            message: `Succès: ${guards.length} gardes placés pour couvrir le polygone.`,
        };
    }
}


class DualGraph {
    constructor(triangles) {
        this.vertices = new Map(); // Map: triangle -> Node
        this.edges = new Set();    // Set to avoid duplicate edges
        this.caterpillar = null;
        this.constructGraph(triangles);
    }

    constructGraph(triangles) {
        // Utiliser une table de hachage pour stocker les triangles par arêtes
        const edgeToTriangles = new Map();

        for (const triangle of triangles) {
            // Obtenir les arêtes du triangle (chaque arête est normalisée)
            const edges = this.getTriangleEdges(triangle);

            for (const edge of edges) {
                // Ajouter l'arête à la map
                if (!edgeToTriangles.has(edge)) {
                    edgeToTriangles.set(edge, []);
                }
                edgeToTriangles.get(edge).push(triangle);
            }
        }

        // Construire les noeuds et leurs voisins
        for (const triangle of triangles) {
            const neighbors = new Set();

            const edges = this.getTriangleEdges(triangle);
            for (const edge of edges) {
                const adjacentTriangles = edgeToTriangles.get(edge) || [];
                for (const neighbor of adjacentTriangles) {
                    if (neighbor !== triangle) {
                        neighbors.add(neighbor);
                        // Ajouter une arête si elle n'existe pas encore
                        const sortedEdge = this.sortEdge(edge);
                        this.edges.add(normalizedEdge);
                    }
                }
            }

            // Créer un noeud pour le triangle
            const node = new Node(triangle, Array.from(neighbors));
            this.vertices.set(triangle, node);
        }
    }

    getTriangleEdges(triangle) {
        // Retourne les arêtes normalisées d'un triangle
        const [a, b, c] = triangle;
        return [
            this.sortEdge([a, b]),
            this.sortEdge([b, c]),
            this.sortEdge([c, a]),
        ];
    }

    sortEdge(edge) {
        return edge[0].x < edge[1].x ? [edge[0], edge[1]] : [edge[1], edge[0]];
    }
}

// Exemple de classe `Node`
class Node {
    constructor(triangle, neighbors) {
        this.triangle = triangle; // Le triangle lui-même
        this.neighbors = neighbors; // Triangles adjacents
    }
}

// Exemple de classe `Edge` (non strictement nécessaire si vous utilisez `normalizeEdge`)
class Edge {
    constructor(v1, v2) {
        this.v1 = Math.min(v1, v2);
        this.v2 = Math.max(v1, v2);
    }

    toString() {
        return `${this.v1}-${this.v2}`;
    }
}

// Fonction utilitaire pour vérifier si deux triangles partagent une arête
function shareEdge(triangle1, triangle2) {
    const edges1 = new Set(triangle1.map((v, i) => [v, triangle1[(i + 1) % 3]].sort().join(',')));
    const edges2 = new Set(triangle2.map((v, i) => [v, triangle2[(i + 1) % 3]].sort().join(',')));
    return [...edges1].some(edge => edges2.has(edge));
}
