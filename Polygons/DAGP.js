class Node{
    constructor(triangle, neighbors) {
        this.triangle = triangle;
        this.neighbors = neighbors;
    }
    
    addNeighbor(neighbor){
        this.neighbors.push(neighbor);
    }

}





class DualGraph {
    constructor(poly) {
        this.polygon = poly;
        this.vertices = [];
        this.constructGraph(poly.ears);
        this.unguardedNodes =this.vertices;
    }

    constructGraph(triangles) {
        "Create a list of Node with the triangles and their neighbors"
        const triangleToNodeMap = new Map(); // dictionnary to map triangle to node

        for (let triangle of triangles) {
            // create a node for each triangle
            let node = new Node(triangle, []);
            triangleToNodeMap.set(triangle, node);
            this.vertices.push(node);
        }

        for (let triangle of triangles) {
            // creates the list of neighboring triangles
            let neighbors = getAdjacentTriangles(triangle, triangles);
            let node = triangleToNodeMap.get(triangle);
            for(let neighbor of neighbors){
                let neighborNode = triangleToNodeMap.get(neighbor);
                node.addNeighbor(neighborNode);
            }
        }
    }


    // find the two leaves of the subregion
    findTwoLeaves(subregion){
        let leaves = [];
        for(let node of subregion){
            let localNeighbors = node.neighbors.filter(neighbor => subregion.has(neighbor));  // consider only the neighbors in the subregion
            if(localNeighbors.length == 1) leaves.push(node);
        }
        return [leaves[0], leaves[1]];
    }

    constructCaterpillar(trianglePath, subregion){
        let caterpillar = {
            path: [],  // path between the two leafs
            feet: new Set(), // ajacent triangles to the path
        };
        for (let triangle of trianglePath) {
            let node = this.vertices.find(node => node.triangle == triangle);
            caterpillar.path.push(node);  // add the node to the path
            for (let neighbor of node.neighbors) {
                if (!trianglePath.includes(neighbor.triangle) && subregion.has(neighbor)) {  // add the neighbors that are not in the path
                    caterpillar.feet.add(neighbor);
                }
            }
        }
        return caterpillar;
    }



    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    
    // check if the distance between the vertex and the guards is greater than 2
    checkDistanceGuards(vertex, guards){
        for(let guard of guards){
            if(guard == vertex) continue;
            if(this.polygon.getDistances(vertex, guard).distance < 2){
                return false;
            }
        }
        return true;
    }


    // check if the triangle is guarded by the guard. A triangle is guarded if all its vertices can be seen by guard
    isGuarded(triangle, guard){
        return this.polygon.seeEachOther(triangle[0], guard) && this.polygon.seeEachOther(triangle[1], guard) && this.polygon.seeEachOther(triangle[2], guard)
    }


    
    setGuards(caterpillar, guards){
        let guardedTriangles = new Set();
        let path = caterpillar.path;
        for(let node of path){
            let triangle = node.triangle;
            if(!guardedTriangles.has(node)){
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
                            guardedTriangles.add(node);
                            vertex.color = "red";
                            break;
                        }
                    }
                    for(let neighbor of node.neighbors){
                        if(!guardedTriangles.has(neighbor)){
                            if(this.isGuarded(neighbor.triangle, guards[guards.length-1])){
                                guardedTriangles.add(neighbor);
                            }
                        }
                    }
                }
            }
        }
        for(let foot of caterpillar.feet){
            if(!guardedTriangles.has(foot)){
                let isGuarded = false;
                for(let guard of guards){
                    if(this.isGuarded(foot.triangle, guard)){
                        guardedTriangles.add(foot);
                        isGuarded = true;
                        break;
                    }
                }
                if(!isGuarded){
                    let triangle = foot.triangle;
                    for(let vertex of triangle){
                        if(this.checkDistanceGuards(vertex, guards)){
                            guards.push(vertex);
                            vertex.color = "red";
                            break;
                        }
                    }
                }
            }
        }
        this.unguardedNodes = this.unguardedNodes.filter(node => !guardedTriangles.has(node));
        return guards;
    }
    

    // dfs to partition the unguarded triangles into subregions
    partitionSubregions(uncoveredTriangles) {
        let visited = new Set();
        let subregions = [];

        for (let node of uncoveredTriangles) {  
            if (!visited.has(node)) {
                let stack = [node];
                let component = new Set();

                while (stack.length > 0) {
                    let current = stack.pop();
                    if (!visited.has(current)) {
                        visited.add(current);
                        component.add(current);

                        for (let neighbor of current.neighbors) {
                            if (uncoveredTriangles.includes(neighbor) && !visited.has(neighbor)) {  // check if the neighbor is unguarded
                                stack.push(neighbor);
                            }
                        }
                    }
                }
                subregions.push(component);  // add the connected component to the list of subregions
            }
        }

        return subregions;
    }




}




function solveDAGP(){
    if (checkCollision()) {
        resultMessage = "COLLISION, create a simple polygon";
      } else {
        createPolygon = true;
        let pts = points.slice(); // copy of the list of points
        pts = ensureCounterClockWise(pts); // check the order
        let poly = new Polygon(pts);
        if(!poly.checkPolygonValid()){
            resultMessage = "Distance between vertices too small. It must be greater than 1";
            return;
        }
        let dualGraph = new DualGraph(poly); // create the dual graph
        let guards = [];
        while (true) {
            let uncoveredTriangles = dualGraph.unguardedNodes;
            if (uncoveredTriangles.length === 0) break; // All triangles are guarded
    
            let subregions = dualGraph.partitionSubregions(uncoveredTriangles);  // partition the unguarded triangles into subregions (connected components)
            let guards = [];
            for (let subregion of subregions) {  // solve every subregion
                let trianglePath = [];
                if (subregion.size == 1) {
                    trianglePath = [...subregion].map(node => node.triangle);
                }
                else{
                    let leaves = dualGraph.findTwoLeaves(subregion);  // find two leaves of the subregion
                    let localTriangles = [...subregion].map(node => node.triangle);  
                    trianglePath = findTrianglePath(leaves[0].triangle, leaves[1].triangle, localTriangles); // find the path between the two leaves
                }
                let caterpillar = dualGraph.constructCaterpillar(trianglePath, subregion);
                guards = dualGraph.setGuards(caterpillar, guards);
            }
        }
        console.log(guards);
      }

}



class Distance {
    constructor(origin, end, path, distance) {
        this.origin = origin;
        this.end = end;
        this.path = path;
        this.distance = distance;
        path.length ==2 ? this.isVisible = true : this.isVisible = false;  // if the path is a staight line inside the polygon, two point can see each other
    }
}


class Polygon{
    constructor(points){
        this.points = points;
        let pts = points.slice();
        this.ears = triangulate(pts);
        console.log(this.ears);
        this.distances = this.calculateDistances();
    }

    // calculate the geodesic distance between each pair of points
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

    // get the distance between two points
    getDistances(i,j){
        for(let distance of this.distances){
            if((distance.origin == i && distance.end == j)||(distance.origin == j && distance.end == i)){
                return distance;
            }
        }
    }

    // check if two points can see each other
    seeEachOther(i,j){
        return i == j ? true : this.getDistances(i, j).isVisible;
    }


    // check if the distance between each pair of points is greater than 1
    checkPolygonValid(){
        for(let distance of this.distances){
            if((distance.distance < 1)){
                return false;
            }
        }
        return true;
    }
}