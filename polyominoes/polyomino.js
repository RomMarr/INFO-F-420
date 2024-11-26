// Define the Polyomino Class
class Polyomino {
    constructor(squares) {
        this.squares = squares; // squares composing the polyomino
        this.size = 0;
        this.boundaries =[]; // edges of the boundaries of the polyomino
        this.vertices = [];  // vertices of edges of the polyomino
        this.guards = [];  // guards of the polyomino
        this.subPolyominoes = [];
        this.valid = this.isValid();
        this.gate;
    }

    // Getter of the squares
    getSquares(){
        return this.squares
    }

    // Setter of the squares
    setSquares(squares){
        this.squares = squares;
    }

    // Getter of the number of subPolyominoes
    getNbSubPolyominoes(){
        return this.subPolyominoes.length;
    }
    
    // Check if the polyomino is valid
    isValid(){
        if (this.areSquaresConnected()){ // Check if the squares are connected
            this.squares = this.getActiveSquares(); 
            this.size = this.squares[0].size;
            return true;
        }return false;
    }

    // Function to start the polyomino and generate its information
    start(isMainPolyomino){
        if (isMainPolyomino){ // If it is the main polyomino it has not been initialized yet
            this.initialize() // Get the boundaries and the vertices
            this.placeFirstGuard();
        }
        this.orderBoundariesFromGuard(); // Order the boundaries from the guard
        this.rVisibility(this.guards[0]); // Get the R-visibility of the guard
        this.generateSubpolyominoes();
        this.generateGates();
        this.toDraw();
    }
    
    // set the mandatory elements to draw the polyomino and the gates
    toDraw(){
        for (let sub of this.subPolyominoes) {
            for (let ent of sub.gate.entry) entriess.push(ent);
            for (let dor of sub.gate.doors) doorss.push(dor);
        }
    }
    
    // Initialize the polyomino by getting the boundaries and the vertices
    initialize(){
        this.getBoundaries();
        this.getVertices();
    }

    // Get the boundaries of the polyomino
    getBoundaries() {
        for (let square of this.squares) {
            if (square.active) {
                let boundaries = getEdgesFromSquare(square); // Get edges of active square
                let neighbors = this.getDirectNeighbors(square, this.squares); // Find active neighbors
                for (let neighbor of neighbors) {
                    if (neighbor.active) {
                        // Get edges of neighboring active square
                        for (let edge of getEdgesFromSquare(neighbor)) {
                            // Find the reverse edge in boundaries
                            let reverseEdge = [edge[1], edge[0]];
                            let index = boundaries.findIndex(boundaryEdge => arraysEqual(boundaryEdge, reverseEdge));
                            if (index !== -1) {
                                // Remove the boundary edge if the reverse edge is found in the neighbor
                                boundaries.splice(index, 1);
                            }
                        }
                    }
                }
    
                // Add remaining boundaries to `this.boundaries`
                for (let boundary of boundaries) {
                    this.boundaries.push(boundary);
                }
            }
        }
        this.sortBoundaries();
    }

    // Sort the boundaries of the polyomino
    sortBoundaries(){
        let sorted = [];
        let current = this.boundaries[0];
        sorted.push(current);
        while (sorted.length < this.boundaries.length){ // Sort the boundaries in clockwise order
            for (let edge of this.boundaries){
                if (comparePoints(current[1],edge[0]) ){
                    sorted.push(edge);
                    current = edge;
                }
            }
        }this.boundaries = sorted;
    }

    // Order the boundaries from the guard position 
    orderBoundariesFromGuard(){
            let rotatedList = [];
            let startIndex = this.findEdgeStartingWithGuard();
            for (let i = startIndex; i < this.boundaries.length; i++) { // Order the boundaries from the guard
                rotatedList.push(this.boundaries[i]);
            }
            for (let i = 0; i < startIndex; i++) { // Order the boundaries from the guard
                rotatedList.push(this.boundaries[i]);
            }
           this.boundaries = rotatedList; // Update the boundaries
    }

    // Get the vertices of the polyomino
    getVertices(){
        for (let edge of this.boundaries){
            for (let point of edge){
                if (!pointExistsInArray(point, this.vertices)){
                    this.vertices.push(point);
                }
            }
        }
    } 

    // Place the first guard randomly on one of the vertices
    placeFirstGuard(){
        let randomVertex = this.vertices[floor(Math.random() * this.vertices.length)];
        let guard = new Guard(randomVertex);
        this.guards.push(guard);
    }

    // Check if a rectangle is watched by the guard
    isRenctangleWatched(p,q, adapted){
        let squaresOfRectangle = [];
        let coordinates = getRectangle(p,q);
        let minX = coordinates[0] + this.size/2 - 1;
        let minY = coordinates[1] +this.size/2 - 1;
        let maxX = coordinates[2];
        let maxY = coordinates[3];
        if (!adapted){
            minX = coordinates[0];
            minY = coordinates[1];
        } // check if all the squares of the rectangle "watched" exist in the polyomino
        for (let x = minX; x <= maxX; x+= this.size){
            for (let y = minY; y <= maxY; y+= this.size){
                let index = this.getSquareIndexAtPoint(new Point(x,y)); // returns -1 if the square does not exist
                if (index == -1) return null;
                squaresOfRectangle.push(this.squares[index]);
            }
        }
        return squaresOfRectangle;
    }

    // Get the R-visibility of the guard (rectangle watched by the guard)
    rVisibility(guard){
        let guardVisibility = [];
        let squaresToCheck = this.squares.slice();
        while (squaresToCheck.length != 0 ) { 
            let point = squaresToCheck.pop().middle; // get the middle of the square
            let squaresOfRectangle = this.isRenctangleWatched(guard.getPosition(),point, true);
            if (squaresOfRectangle != null){  // the rectangle is composed of squares that are in the polyomino
                for (let square of squaresOfRectangle){
                    let index = squaresToCheck.indexOf(square); 
                    if (index != -1) squaresToCheck.splice(index,1); // remove the square from the list
                    if (!square.watched) {
                        square.watched = true;
                        guardVisibility.push(square);
                    }
                }
            }
        }
        let guardRview = new Polyomino(guardVisibility) // Create a polyomino of the watched squares
        guardRview.initialize();
        guard.addVisibility(guardRview); // Add the R-visibility to the guard
    }

    // Get the unwatched squares of the polyomino
    getUnwatchedSquares(){
        let unwatchedSquares = []
        for (let square of this.squares){
            if (!square.watched) unwatchedSquares.push(square);
        }return unwatchedSquares;
    }

    // Generate the subpolyominoes of the polyomino
    generateSubpolyominoes() {
        let unwatched = this.getUnwatchedSquares();
        let remainingBoundaries = this.boundaries.slice(); // Copy of boundaries
    
        // Iterate over boundaries in clockwise order to find connected unwatched squares
        while (remainingBoundaries.length > 0) {
            let boundaryEdge = remainingBoundaries.shift(); // Take the next clockwise edge
            let startPoint = boundaryEdge[0];
            let endPoint = boundaryEdge[1];
    
            // Find any unwatched square connected to this boundary edge
            let connectedSquare = null;
            for (let square of unwatched) {
                for (let corner of square.corners) {
                    if (comparePoints(startPoint, corner) || comparePoints(endPoint, corner)) {
                        connectedSquare = square;
                        break;
                    }
                }}
    
            if (connectedSquare) {
                // Find all squares connected to this one
                let squaresConnected = this.getConnectedSquares(connectedSquare, unwatched);
                let subPolyomino = new Polyomino(squaresConnected);
                subPolyomino.initialize();
                this.subPolyominoes.push(subPolyomino);
    
                // Remove connected squares from the unwatched list
                for (let squareUsed of squaresConnected) {
                    let index = unwatched.indexOf(squareUsed);
                    if (index != -1) unwatched.splice(index, 1);
                }
    
                // Remove corresponding boundaries related to this subpolyomino

                for (let square of squaresConnected) {
                    let edges = getEdgesFromSquare(square);
                    for (let edge of edges) {
                        for (let boundarie of remainingBoundaries) {
                            if (compareEdgesNonDirection(edge, boundarie)) {
                                let index = remainingBoundaries.indexOf(boundarie);
                                if (index !== -1) {
                                    remainingBoundaries.splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Generate the gates of the subpolyominoes
    generateGates() {
        let viewBoundaries = this.guards[0].visibility.boundaries; // Get the boundaries of the guard's view
        for (let subPolyomino of this.subPolyominoes) {
            let listEdge = [];
            for (let edge of subPolyomino.boundaries){ // Check if the edge is in the view boundaries
                if (compareEdgeList(edge, viewBoundaries)) {
                    listEdge.push(edge);
                }
            }
            subPolyomino.gate = new Gate(listEdge); 
            this.generateDoors(subPolyomino); // Generate the doors of the subpolyomino's gate
        }
    }

    // Generate the doors of the subpolyomino's gate
    generateDoors(subPolyomino) {
        let doors = [];
        for (let edgePolyomino of this.boundaries) {
            for (let edgeEntry of subPolyomino.gate.entry) {
                // Check if the edge is adjacent to the entry and not in the boundaries
                if (edgeAdjacent(edgePolyomino,edgeEntry) && !compareEdgeList(edgePolyomino,subPolyomino.boundaries)) {
                    doors.push(edgePolyomino);
                }
            }
        } subPolyomino.gate.addDoors(doors);
    }

    // Calculate the alpha distance of the polyomino (clockwise distance)
    calculateDistanceAlpha() {
        let distance = 1;
        for (let edge of this.boundaries){
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                // Check if the edge is in the entry of the gate
                if (isPointInEdges(edge[1],gate.entry)) return distance;
            } distance +=1;
        } return -1;
    }

    // Calculate the beta distance of the polyomino (counter-clockwise distance)
    calculateDistanceBeta() {
        let distance = 1;
        for (let indice = this.boundaries.length - 1; indice >= 0; indice--) {
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                // Check if the edge is in the entry of the gate
                if (isPointInEdges(this.boundaries[indice][0],gate.entry)) return distance;
            } distance += 1;
        } return - 1;
    }

    // Find the index of the edge starting with the guard
    findEdgeStartingWithGuard() {
        let i = 0;
        while (i <= this.boundaries.length) { // go through the boundaries to find the one starting with the guard 
            // Check if the edge is in the entry of the gate
            if (comparePoints(this.guards[0].getPosition(),this.boundaries[i][0])) return i;
            i+=1;
        } return -1;
    }

    // Get the index of the square containing the point (-1 if not found)
    getSquareIndexAtPoint(point) {
        // Loop through all squares to find one that contains the point
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].isInside(point.x, point.y)) { // Adjusting for button area
                return i; // Return the index of the square
            }
        }
        return -1; // Return -1 if no square contains the point
    }
  
    // Returns the active squares of the polyomino
    getActiveSquares() {
        const activeSquares = [];
        for (let square of this.squares) {
            if (square.active) activeSquares.push(square);
        } return activeSquares;
    }

    // Returns the number of active squares
    getNbActiveSquares() {
        let count = 0;
        for (let square of this.squares) {
            if (square.active) count++;
        } return count;
    }

    // Get the direct neighbors of a square in the list of squares
    getDirectNeighbors(square, squares) {
        const squareSize = square.size; 
        const neighbors = [];
        // Loop through all squares to find those adjacent to the square
        for (let i = 0; i < squares.length; i++) {
            const other = squares[i];
            // Check if 'other' is to the left, right, above, or below the square
            if (
                (other.x === square.x - squareSize && other.y === square.y) ||  // Left neighbor
                (other.x === square.x + squareSize && other.y === square.y) ||  // Right neighbor
                (other.y === square.y - squareSize && other.x === square.x) ||  // Above neighbor
                (other.y === square.y + squareSize && other.x === square.x)     // Below neighbor
            ) neighbors.push(other); // Add the neighbor to the list
        } return neighbors;
    }

    // BFS to get all connected squares
    getConnectedSquares(square, squares) {
        let stack = [square];
        let connectedSquares = [square];
        while (stack.length != 0) {
            let actualSquare = stack.pop();
            for (let neighbor of this.getDirectNeighbors(actualSquare, squares)) { // Get the neighbors of the square
                if (!connectedSquares.includes(neighbor)) {  // Add the neighbor to the connected squares
                    connectedSquares.push(neighbor);
                    stack.push(neighbor);
                }
            }
        } return connectedSquares;
    }

    // Function to check if all active squares are connected (given by ChatGPT)
    areSquaresConnected() {
        const nbActiveSquares = this.getNbActiveSquares();
        if (nbActiveSquares === 0) return false; // No active squares to check
        if (nbActiveSquares === 1) return true;  // Only one square, it's trivially connected
        // Find the first active square as the starting point
        let startSquare = null;
        for (let square of this.squares) {
            if (square.active) {
                startSquare = square;
                break;
            }
        }
        // If no active square is found (shouldn't happen due to previous checks)
        if (!startSquare) return false;
        // Perform BFS/DFS to count reachable active squares
        const visited = new Set();
        const stack = [startSquare];
        let count = 0;
        while (stack.length > 0) {
            const square = stack.pop();
            // Use stringified coordinates as a unique key for each square
            const key = `${square.x},${square.y}`;
            if (visited.has(key)) continue;
            visited.add(key);
            count++;
            // Get active neighbors and add them to the stack
            const neighbors = this.getDirectNeighbors(square, this.squares);
            for (let neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (neighbor.active && !visited.has(neighborKey)) {
                    stack.push(neighbor);
                }
            }
        }
        return count === nbActiveSquares;  // If we've reached all active squares, they're connected
    }

    // Get the base rectangle of the gate. 
    //The base rectangle is the direction in which we need to expend the rectangle 
    //to get the rectangleT -> Check in the 4 directions if the squares exist
    getBaseRectangle(gatePoints){
        let sens1, sens2, incr, maxRectangle; // sens1 and sens2 are the points of the rectangle, incr is the increment and maxRectangle is the biggest rectangleT possible
        if (this.gate.isHorizontal){ // if the gate is horizontal
            // go down (P5 canvas is inverted)
            sens1 = new Point(gatePoints[0] + 1, gatePoints[2] + 1);
            sens2 = new Point(gatePoints[1] - 1, gatePoints[2] + this.size/2);
            maxRectangle = this.isRenctangleWatched(sens1,sens2,false)
            if (maxRectangle != null) incr = new Point(0, this.size); // point to increment to get the biggest rectangleT possible
            else { // go up 
                sens1 = new Point(gatePoints[0] + 1,gatePoints[2] - 1);
                sens2 = new Point(gatePoints[1] - 1,gatePoints[2] - this.size/2);
                incr = new Point(0, -this.size); 
                maxRectangle = this.isRenctangleWatched(sens1,sens2,false);
            }
        } else { // if the gate is vertical
            // go right
            sens1 = new Point(gatePoints[2] + 1,gatePoints[0] + 1);
            sens2 = new Point(gatePoints[2] + this.size/2,gatePoints[1] - 1);
            maxRectangle = this.isRenctangleWatched(sens1,sens2)
            if (maxRectangle != null) incr = new Point(this.size, 0);
            else { // go left
                sens1 = new Point(gatePoints[2] - 1, gatePoints[0] + 1);
                sens2 = new Point(gatePoints[2] - this.size/2,gatePoints[1] - 1);
                incr = new Point(-this.size, 0);   
                maxRectangle = this.isRenctangleWatched(sens1,sens2, false);
            }
        }return [sens1, sens2, incr, maxRectangle];
    }

    // Get the biggest rectangle adjacent to the gate -> gatepPoints : [min, max, x or y]
    biggestRectangleAdjacentToGate(gatePoints){
        if (gatePoints[2] == null) return null;  
        let [sens1, sens2, incr, maxRectangle] = this.getBaseRectangle(gatePoints);
        let flag = true;
        let rectangle;
        while(flag){ // increment the rectangle until it is not watched
            sens2 = additionPoints(sens2, incr);  // increment the rectangle
            rectangle = this.isRenctangleWatched(sens1,sens2, false);  // check if the rectangle is watched (exists)
            if (rectangle == null) flag = false;
            else maxRectangle = rectangle;  // update the biggest rectangle
        } return [maxRectangle, incr];
    }
}
