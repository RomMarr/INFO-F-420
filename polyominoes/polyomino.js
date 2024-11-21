// Define the Polyomino Class
class Polyomino {
    constructor(squares) {
        this.squares = squares;
        this.size = 0;
        this.boundaries =[]; 
        this.vertices = [];
        this.guards = [];
        this.subPolyominoes = [];
        this.valid = this.isValid();
        this.gate;
    }

    getSquares(){
        return this.squares
    }

    setSquares(squares){
        this.squares = squares;
    }

    get_nb_sub_polyominoes(){
        return this.subPolyominoes.length;
    }
    
    isValid(){
        if (this.areSquaresConnected()){
            this.squares = this.getActiveSquares();
            this.size = this.squares[0].size;
            return true;
        }return false;
    }

    start(){
        this.initialize()
        this.place_first_guard();
        this.r_visibility(this.guards[0]);
        this.generate_subpolyominoes();
        this.generate_gates();
        this.test();
    }
    
    test(){
        console.log("Poly :", this.squares);
        for (let sub of this.subPolyominoes) {
            console.log("Sub :", sub);
            console.log("Doors", sub.gate);
            console.log("Entries :", sub.gate.entry);
            for (let ent of sub.gate.entry){
                entriess.push(ent);
            }
            for (let dor of sub.gate.doors){
                doorss.push(dor);
            }
        }
    }
    
    initialize(){
        this.get_boundaries();
        this.get_vertices();
    }

    
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
        }this.sortBoundaries();
    }


    sortBoundaries(){
        let sorted = [];
        let current = this.boundaries[0];
        sorted.push(current);
        let i = 0;
        while (sorted.length != this.boundaries.length){
            for (let edge of this.boundaries){
                if (compare_points(current[1],edge[0])){
                    sorted.push(edge);
                    current = edge;
                    i += 1;
                }
            }
        }this.boundaries = sorted;
    }

    get_vertices(){
        for (let edge of this.boundaries){
            for (let point of edge){
                if (!pointExistsInArray(point, this.vertices)){
                    this.vertices.push(point);
                }
            }
        }
    } 

    place_first_guard(){
        let random_vertex = this.vertices[floor(Math.random() * this.vertices.length)];
        let guard = new Guard(random_vertex);
        this.guards.push(guard);
    }


    is_renctangle_watched(p,q){
        let squares_of_rectangle = [];
        let coordinates = getRectangle(p,q);
        let min_x = coordinates[0];
        let min_y = coordinates[1];
        let max_x = coordinates[2];
        let max_y = coordinates[3];
        for (let x = min_x + this.size/2 - 1; x <= max_x; x+= this.size){
            for (let y = min_y+ this.size/2 - 1; y <= max_y; y+= this.size){
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
            let squares_of_rectangle = this.is_renctangle_watched(guard.get_position(),point);
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
        guard.add_visibility(guard_Rview);
    }

    get_unwatched_squares(){
        let unwatched_squares = []
        for (let square of this.squares){
            if (!square.watched) unwatched_squares.push(square);
        }return unwatched_squares;
    }

    generate_subpolyominoes() {
        let unwatched = this.get_unwatched_squares();
        while (unwatched.length > 0) {
            let squares_connected = this.get_connected_squares(unwatched[0], unwatched);
            let sub_polyomino = new Polyomino(squares_connected);
            sub_polyomino.initialize();
            this.subPolyominoes.push(sub_polyomino);
            for (let square_used of squares_connected) {
                let index = unwatched.indexOf(square_used);
                unwatched.splice(index,1);
            }
        }
    }

    generate_gates() {
        let view_boundaries = this.guards[0].visibility.boundaries;
        for (let sub_polyomino of this.subPolyominoes) {
            let list_edge = [];
            for (let edge of sub_polyomino.boundaries){
                if (compare_edge_list(edge, view_boundaries )) {
                    list_edge.push(edge);
                }
            }
            sub_polyomino.gate = new Gate(list_edge); 
            this.generate_doors(sub_polyomino);
        }
    }

    generate_doors(sub_polyomino) {
        let doors = [];
        for (let edge_polyomino of this.boundaries) {
            for (let edge_entry of sub_polyomino.gate.entry) {
                if (edge_adjacent(edge_polyomino,edge_entry) && !compare_edge_list(edge_polyomino,sub_polyomino.boundaries)) {
                    doors.push(edge_polyomino);
                }
            }
        }
        sub_polyomino.gate.add_doors(doors);
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
        let size_boundaries = this.boundaries.length;
        let indice = this.find_edge_ending_with_guard() + 1;
        let distance = 1;
        while(distance <= size_boundaries) {
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                if (is_point_in_edges(this.boundaries[indice][1],gate.entry)) {
                    return distance;
                }
                }
            
            indice =(indice +1)% size_boundaries;
            distance +=1;
        }
        return -1;
    }

    calculate_distance_beta() {
        let size_boundaries = this.boundaries.length;
        let indice = this.find_edge_ending_with_guard();
        let distance = 1;
        while(distance <= size_boundaries) {
            if (indice == -1) {indice = size_boundaries -1;}
            for (let sub of this.subPolyominoes){
                let gate = sub.gate;
                if (is_point_in_edges(this.boundaries[indice][0],gate.entry)) {
                    return distance;
                }
                }
            indice -=1;
            distance +=1;
        }
        return -1;
    }

    find_edge_ending_with_guard() {
        let i = 0;
        while (i <= this.boundaries.length) {
            if (compare_points(this.guards[0].get_position(),this.boundaries[i][1])) {
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
    
        // If we've reached all active squares, they're connected
        return count === nbActiveSquares;
    }
}





