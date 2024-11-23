class Node{
    constructor(triangle, neighbors) {
        this.node = triangle;
        this.neighbors = neighbors;
    }
}

class Edge{
    constructor(triangle1, triangle2) {
        this.edge = [triangle1, triangle2];
    }
}



class DualGraph {
    constructor(poly) {
        this.polygon = poly;
        this.vertices = [];
        this.edges = [];
        this.constructGraph(poly.ears);
        this.caterpillar= null;
    }

    constructGraph(triangles) {
        for (let triangle of triangles) {
            let neighbors = getAdjacentTriangles(triangle, triangles);
            let node = new Node(triangle, neighbors);
            neighbors.forEach(neighbor => {this.edges.push(new Edge(triangle, neighbor))});
            this.vertices.push(node);
        }
    }

    findLeaf(){
        let leafs = [];
        for(let node of this.vertices){
            if(node.neighbors.length == 1) leafs.push(node);
        }
        return [leafs[0], leafs[1]];
    }

    constructCaterpillar(trianglePath){
        let caterpillar = {
            path: [], // Triangles du chemin principal
            feet: new Set(), // Triangles adjacents au chemin
        };
        for (let triangle of trianglePath) {
            let node = this.vertices.find(node => node.node == triangle);
            caterpillar.path.push(node);
            for (let neighbor of node.neighbors) {
                if (!trianglePath.includes(neighbor)) {
                    caterpillar.feet.add(neighbor);
                }
            }
        }
        this.caterpillar = caterpillar;
    }



    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    
    checkDistanceGuards(vertex, guards){
        for(let guard of guards){
            if(guard == vertex) continue;
            if(this.polygon.getDistances(vertex, guard).distance < 2){
                return false;
            }
        }
        return true;
    }

    isGuarded(triangle, guard){
        return this.polygon.seeEachOther(triangle[0], guard) && this.polygon.seeEachOther(triangle[1], guard) && this.polygon.seeEachOther(triangle[2], guard)
    }

    setGuards(){
        let guards = [];
        let guardedTriangles = new Set();
        let path = this.caterpillar.path;
        for(let node of path){
            let triangle = node.node;
            if(!guardedTriangles.has(triangle)){
                let isGuarded = false;
                for(let guard of guards){
                    if(this.isGuarded(triangle, guard)){
                        guardedTriangles.add(triangle);
                        isGuarded = true;
                        break;
                    }
                }
                if(!isGuarded){
                    for(let vertex of triangle){
                        if(this.checkDistanceGuards(vertex, guards)){
                            guards.push(vertex);
                            vertex.color = "red";
                            break;
                        }
                    }
                    for(let neighbor of node.neighbors){
                        if(!guardedTriangles.has(neighbor)){
                            if(this.isGuarded(neighbor, guards[guards.length-1])){
                                guardedTriangles.add(neighbor);
                            }
                        }
                    }
                }
            }
        }
        for(let foot of this.caterpillar.feet){
            if(!guardedTriangles.has(foot)){
                let isGuarded = false;
                for(let guard of guards){
                    if(this.isGuarded(foot, guard)){
                        guardedTriangles.add(foot);
                        isGuarded = true;
                        break;
                    }
                }
                if(!isGuarded){
                    for(let vertex of foot){
                        if(this.checkDistanceGuards(vertex, guards)){
                            guards.push(vertex);
                            vertex.color = "red";
                            break;
                        }
                    }
                }
            }
        }
        return guards;
    }


}




function solveDAGP(polygon){
    if (checkCollision()) {
        resultMessage = "COLLISION, create a simple polygon";
      } else {
        createPolygon = true;
        let pts = points.slice(); // Copie de la liste de points
        pts = ensureCounterClockWise(pts); // Vérification de l'ordre
        let poly = new Polygon(pts);
        if(!poly.checkPolygonValid()){
            resultMessage = "Distance between vertices too small. It must be greater than 1";
            return;
        }
        let dualGraph = new DualGraph(poly);
        let leafs = dualGraph.findLeaf();
        let Trianglepath = findTrianglePath(leafs[0].node, leafs[1].node, poly.ears);
        dualGraph.constructCaterpillar(Trianglepath);
        let guards= dualGraph.setGuards();
        console.log(guards);
      }

}



class Distance {
    constructor(origin, end, path, distance) {
        this.origin = origin;
        this.end = end;
        this.path = path;
        this.distance = distance;
        path.length ==2 ? this.isVisible = true : this.isVisible = false;
    }
}


class Polygon{
    constructor(points){
        this.points = points;
        let pts = points.slice();
        this.ears = triangulate(pts);
        this.distances = this.calculateDistances();
    }


    calculateDistances(){
        let distances = [];
        for (let i = 0; i < this.points.length-1; i++) {
            for (let j = i+1; j < this.points.length; j++) {
                let distance = calculateGeodesicDistance(this.points[i], this.points[j], this.ears);
                distances.push(distance);
            }
        }
        return distances;
    }

    getDistances(i,j){
        for(let distance of this.distances){
            if((distance.origin == i && distance.end == j)||(distance.origin == j && distance.end == i)){
                return distance;
            }
        }
    }


    seeEachOther(i,j){
        return i == j ? true : this.getDistances(i, j).isVisible;
    }


    
    checkPolygonValid(){
        for(let distance of this.distances){
            if((distance.distance < 1)){
                return false;
            }
        }
        return true;
    }
}