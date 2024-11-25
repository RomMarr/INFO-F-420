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
    start(){
        this.initialize() // Get the boundaries and the vertices
        this.place_first_guard();
        this.orderBoundariesFromGuard(); // Order the boundaries from the guard
        this.r_visibility(this.guards[0]); // Get the R-visibility of the guard
        this.generate_subpolyominoes();
        this.generate_gates();
        this.toDraw();
    }

    // Function to start the subPolyomino and generate its information (first guard is not applicable here)
    start2(){
        this.orderBoundariesFromGuard();
        this.r_visibility(this.guards[0]);
        this.generate_subpolyominoes();
        this.generate_gates();
        this.toDraw();
    }
    
    // set the mandatory elements to draw the polyomino and the gates
    toDraw(){
        for (let sub of this.subPolyominoes) {
            gates.push(sub.gate);
            for (let ent of sub.gate.entry){
                entriess.push(ent);
            }
            for (let dor of sub.gate.doors){
                doorss.push(dor);
            }
        }
    }
    
    // Initialize the polyomino by getting the boundaries and the vertices
    initialize(){
        this.get_boundaries();
        this.get_vertices();
    }

    // Get the boundaries of the polyomino
    get_boundaries() {
        for (let square of this.squares) {
            if (square.active) {
                let boundaries = this.get_edges(square); // Get edges of active square
                let neighbors = this.getDirectNeighbors(square, this.squares); // Find active neighbors
                for (let neighbor of neighbors) {
                    if (neighbor.active) {
                        // Get edges of neighboring active square
                        for (let edge of this.get_edges(neighbor)) {
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
            let startIndex = this.find_edge_starting_with_guard();
            for (let i = startIndex; i < this.boundaries.length; i++) { // Order the boundaries from the guard
                rotatedList.push(this.boundaries[i]);
            }
            for (let i = 0; i < startIndex; i++) { // Order the boundaries from the guard
                rotatedList.push(this.boundaries[i]);
            }
           this.boundaries = rotatedList; // Update the boundaries
        }

    // Get the vertices of the polyomino
    get_vertices(){
        for (let edge of this.boundaries){
            for (let point of edge){
                if (!pointExistsInArray(point, this.vertices)){
                    this.vertices.push(point);
                }
            }
        }
    } 

    // Place the first guard randomly on one of the vertices
    place_first_guard(){
        let random_vertex = this.vertices[floor(Math.random() * this.vertices.length)];
        let guard = new Guard(random_vertex);
        this.guards.push(guard);
    }


    is_renctangle_watched(p,q, adapted){
        let squares_of_rectangle = [];
        let coordinates = getRectangle(p,q);
        let min_x = coordinates[0] + this.size/2 - 1;
        let min_y = coordinates[1] +this.size/2 - 1;
        let max_x = coordinates[2];
        let max_y = coordinates[3];
        if (!adapted){
            min_x = coordinates[0];
            min_y = coordinates[1];
        }
        for (let x = min_x; x <= max_x; x+= this.size){
            for (let y = min_y; y <= max_y; y+= this.size){
                let index = this.getSquareIndexAtPoint(new Point(x,y)); 
                if (index == -1){
                    return null;
                } squares_of_rectangle.push(this.squares[index]);
            }
        }
        return squares_of_rectangle;
    }

    r_visibility(guard){
        let guard_visibility = [];
        let squares_to_check = this.squares.slice();
        while (squares_to_check.length != 0 ) {
            let point = squares_to_check.pop().middle;
            let squares_of_rectangle = this.is_renctangle_watched(guard.getPosition(),point, true);
            if (squares_of_rectangle != null){  // the rectangle is composed of squares that are in the polyomino
                for (let square of squares_of_rectangle){
                    let index = squares_to_check.indexOf(square);
                    if (index != -1) squares_to_check.splice(index,1);
                    if (!square.watched) {
                        square.watched = true;
                        guard_visibility.push(square);
                    }
                }
            }
        }
        let guard_Rview = new Polyomino(guard_visibility)
        guard_Rview.initialize();
        guard.addVisibility(guard_Rview);
    }

    get_unwatched_squares(){
        let unwatched_squares = []
        for (let square of this.squares){
            if (!square.watched) unwatched_squares.push(square);
        }return unwatched_squares;
    }

    generate_subpolyominoes() {
        let unwatched = this.get_unwatched_squares();
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
                let squaresConnected = this.get_connected_squares(connectedSquare, unwatched);
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
                    let edges = this.get_edges(square);
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

    

    generate_gates() {
        let view_boundaries = this.guards[0].visibility.boundaries;
        let i = 0;
        for (let sub_polyomino of this.subPolyominoes) {
            let list_edge = [];
            for (let edge of sub_polyomino.boundaries){
                if (compareEdgeList(edge, view_boundaries)) {
                    list_edge.push(edge);
                }
            }
            i += 1;
            sub_polyomino.gate = new Gate(list_edge); 
            this.generate_doors(sub_polyomino);
        }
    }

    generate_doors(sub_polyomino) {
        let doors = [];
        for (let edge_polyomino of this.boundaries) {
            for (let edge_entry of sub_polyomino.gate.entry) {
                if (edgeAdjacent(edge_polyomino,edge_entry) && !compareEdgeList(edge_polyomino,sub_polyomino.boundaries)) {
                    doors.push(edge_polyomino);
                }
            }
        }
        sub_polyomino.gate.addDoors(doors);
    }

    get_edges(square) {
        let edges = [];
        let corners = square.corners;
        for (let i = 0; i < corners.length; i++) {
            edges.push([corners[i], corners[(i + 1) % corners.length]]);
        }
        return edges;
    }


    calculate_distance_alpha() {
        let distance = 1;
        for (let edge of this.boundaries){
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                if (isPointInEdges(edge[1],gate.entry)) {
                    return distance;
                }
                }
            
            distance +=1;
        }
        return -1;
    }

    calculate_distance_beta() {
        let distance = 1;
        for (let indice = this.boundaries.length - 1; indice >= 0; indice--) {
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                if (isPointInEdges(this.boundaries[indice][0],gate.entry)) {
                    return distance;
                }
            }
            distance +=1;
        }
        return -1;
    }

    find_edge_starting_with_guard() {
        let i = 0;
        while (i <= this.boundaries.length) {
            if (comparePoints(this.guards[0].getPosition(),this.boundaries[i][0])) {
                return i;
            }
            i+=1;
        }
        return -1;
    }

    getSquareIndexAtPoint(point) {
        // Loop through all squares to find one that contains the point
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].isInside(point.x, point.y)) { // Adjusting for button area
                return i; // Return the index of the square
            }
        }
        return -1; // Return -1 if no square contains the point
    }
  
    getActiveSquares() {
        const activeSquares = [];
        for (let square of this.squares) {
            if (square.active) {
                activeSquares.push(square);
            }
        }
        return activeSquares;
    }

    getNbActiveSquares() {
        let count = 0;
        for (let square of this.squares) {
            if (square.active) {
                count++;
            }
        }
        return count;
    }

    getDirectNeighbors(square, squares) {
        const squareSize = square.size; 
        const neighbors = [];
    
        // Loop through all squares to find those adjacent to the given square
        for (let i = 0; i < squares.length; i++) {
            const other = squares[i];
    
            // Check if 'other' is to the left, right, above, or below the given square
            if (
                (other.x === square.x - squareSize && other.y === square.y) ||  // Left neighbor
                (other.x === square.x + squareSize && other.y === square.y) ||  // Right neighbor
                (other.y === square.y - squareSize && other.x === square.x) ||  // Above neighbor
                (other.y === square.y + squareSize && other.x === square.x)     // Below neighbor
            ) {
                neighbors.push(other); // Add the neighbor to the list
            }
        }
        return neighbors;
    }


    get_connected_squares(square, squares) {
        let stack = [square];
        let connected_squares = [square];
        while (stack.length != 0) {
            let actual_square = stack.pop();
            for (let neighbor of this.getDirectNeighbors(actual_square, squares)) {
                if (!connected_squares.includes(neighbor)) {
                    connected_squares.push(neighbor);
                    stack.push(neighbor);
                }
            }
        } return connected_squares;
    }

    // function to check if all active squares are connected (from ChatGPT)
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


    getBaseRectangle(gatePoints){
        let sens1, sens2, incr, maxRectangle;
        if (this.gate.isHorizontal){
            sens1 = new Point(gatePoints[0] + 1, gatePoints[2] + 1);
            sens2 = new Point(gatePoints[1] - 1, gatePoints[2] + this.size/2);
            maxRectangle = this.is_renctangle_watched(sens1,sens2,false)
            if (maxRectangle != null) incr = new Point(0, this.size);
            else {
                sens1 = new Point(gatePoints[0] + 1,gatePoints[2] - 1);
                sens2 = new Point(gatePoints[1] - 1,gatePoints[2] - this.size/2);
                incr = new Point(0, -this.size);
                maxRectangle = this.is_renctangle_watched(sens1,sens2,false);
            }
        }
        else { 
            sens1 = new Point(gatePoints[2] + 1,gatePoints[0] + 1);
            sens2 = new Point(gatePoints[2] + this.size/2,gatePoints[1] - 1);
            maxRectangle = this.is_renctangle_watched(sens1,sens2)
            if (maxRectangle != null) incr = new Point(this.size, 0);
            else {
                sens1 = new Point(gatePoints[2] - 1, gatePoints[0] + 1);
                sens2 = new Point(gatePoints[2] - this.size/2,gatePoints[1] - 1);
                incr = new Point(-this.size, 0);   
                maxRectangle = this.is_renctangle_watched(sens1,sens2, false);
            }
        }return [sens1, sens2, incr, maxRectangle];
    }

    // function to get the biggest rectangle adjacent to the gate -> gatepPoints : [min, max, x or y]
    biggestRectangleAdjacentToGate(gatePoints){
        if (gatePoints[2] == null) return null;
        let [sens1, sens2, incr, maxRectangle] = this.getBaseRectangle(gatePoints);
        let flag = true;
        let rectangle;
        while(flag){
            sens2 = additionPoints(sens2, incr);
            rectangle = this.is_renctangle_watched(sens1,sens2, false);
            if (rectangle == null) flag = false;
            else maxRectangle = rectangle;
            }
        return [maxRectangle, incr];
    }
}
