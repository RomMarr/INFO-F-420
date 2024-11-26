class Gate{
    constructor(entry){
        this.entry = entry;  // edge(s) connecting the view of a guard and the subpolyomino
        this.doors;  // edges next to the entry -> can be [parallel, orthogonal]
        this.orientation; // true = clockwise and false = counter-clockwise
        this.intervals = []; // intervals of the entry
        this.isHorizontal; // true if the entry is horizontal and false if it is vertical
        this.verticalEntries = []; 
        this.horizontalEntries = [];
        this.setEntries(entry);  // Prepare the vertical and horizontal entries
        
    }

    // Prepare the vertical and horizontal entries
    setEntries(entries){
        for (let edge of entries){
            if (edge[0].x == edge[1].x) this.verticalEntries.push(edge);
            if (edge[0].y == edge[1].y) this.horizontalEntries.push(edge);
        }
    }

    // Add the doors to the gate
    addDoors(doors){
        this.doors = doors;
    }
    
    // Change the orientation of the gate
    changeOrientation(orientation){
        this.orientation = orientation;
    }


    // rReturn true if the entry is horizontal and false if it is vertical and set the isHorizontal attribute
    isParallelEntryHorizontal(){  
        if (this.verticalEntries.length==0 && this.horizontalEntries.length>=1) return this.isHorizontal = true;
        return this.isHorizontal = false;
    }

    //Return the interval of the entry of a parallel gate
    giveIntervalEntry(){
        let min = Infinity;
        let max = -Infinity;
        let isHorizontal = this.isParallelEntryHorizontal(); // check if the entry is horizontal or vertical
        for (let edge of this.entry){
            if (isHorizontal){ // if the entry is horizontal
                if (edge[0].x > max) max = edge[0].x;
                if (edge[0].x < min) min = edge[0].x;
                if (edge[1].x > max) max = edge[1].x;
                if (edge[1].x < min) min = edge[1].x;
            }else { // if the entry is vertical
                if (edge[0].y > max) max = edge[0].y;
                if (edge[0].y < min) min = edge[0].y;
                if (edge[1].y > max) max = edge[1].y;
                if (edge[1].y < min) min = edge[1].y;
            }
        }
        if (isHorizontal){ // if the entry is horizontal
            let y = this.entry[0][0].y;
            this.intervals = [new Point(min,y), new Point(max, y)];
            return [min,max,y];  // return the interval of the entry + the y coordinate
        }else { // if the entry is vertical
            let x = this.entry[0][0].x;
            this.intervals = [new Point(x,min), new Point(x, max)]; // set the intervals of the entry
            return [min,max,x]; // return the interval of the entry + the x coordinate
        }
    }



     // Return true if the doors are parallels (if all the points of the doors have the same x or y coordinates).
    areDoorsParallel(){
        if ((this.doors[0][0].x == this.doors[0][1].x && this.doors[1][0].x == this.doors[1][1].x )||
            (this.doors[0][0].y == this.doors[0][1].y && this.doors[1][0].y == this.doors[1][1].y)){
                return true;}
        return false;// Return false if the doors are orthogonal
    }

    // Get the vertical entry of an orthonal gate
    getVertical(){
        this.isHorizontal = false;
        let vertical = [];
        let x;
        for (let edge of this.entry){
            if (edge[0].x == edge[1].x) { // if the edge is vertical
                vertical.push(edge);
                x = edge[0].x;
            }
        }
        let min = Infinity;
        let max = -Infinity;
        for (let edge of vertical){
            if (edge[0].y < min) min = edge[0].y;
            if (edge[0].y > max) max = edge[0].y;
            if (edge[1].y > max) max = edge[1].y;
            if (edge[1].y < min) min = edge[1].y;

        }
        this.intervals = [new Point(min,x), new Point(max, x)]; // set the intervals of the entry
        return [min,max,x]; // return the interval of the entry + the x coordinate
    }

    // Get the horizontal entry of an orthonal gate
    getHorizontal(){
        this.isHorizontal = true;
        let horizontal = [];
        let y;
        for (let edge of this.entry){
            if (edge[0].y == edge[1].y) { // if the edge is horizontal
                y= edge[0].y;
                horizontal.push(edge); }
        }
        let min = Infinity;
        let max = -Infinity;
        for (let edge of horizontal){
            if (edge[0].x > max) max = edge[0].x;
            if (edge[0].x < min) min = edge[0].x;
            if (edge[1].x > max) max = edge[1].x;
            if (edge[1].x < min) min = edge[1].x;
        }
        this.intervals = [new Point(min,y), new Point(max, y)]; // set the intervals of the entry
        return [min,max,y]; // return the interval of the entry + the y coordinate
    }


    // Check if the orthogonal doors are the special case needing an endpoint
    needsEndPoint(){
        // if the doors are orthogonals and the entry is only vertical or only horizontal
        if (this.orientation && this.horizontalEntries.length == 0 ) return true;
        else if (!this.orientation && this.verticalEntries.length == 0) return true;
        return false;
    }
}