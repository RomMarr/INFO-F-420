class Gate{
    constructor(entry){
        this.entry = entry;  // edge(s) connecting the view of a guard and the subpolyomino
        this.doors;  // edges next to the entry -> can be [parallel, orthogonal]
        this.orientation; // true = clockwise and false = counter-clockwise
        this.intervals = []; 
        this.isHorizontal;
        this.verticalEntries = [];
        this.horizontalEntries = [];
        this.setEntries(entry);
        
    }

    setEntries(entries){
        for (let edge of entries){
            if (edge[0].x == edge[1].x) this.verticalEntries.push(edge);
            if (edge[0].y == edge[1].y) this.horizontalEntries.push(edge);
        }
    }

    add_doors(doors){
        this.doors = doors;
    }
    
    change_orientation(orientation){
        this.orientation = orientation;
    }


    // return true if the entry is horizontal and false if it is vertical and set the isHorizontal attribute
    is_parallel_entry_horizontal(){  
        if (this.verticalEntries.length==0 && this.horizontalEntries.length>=1) return this.isHorizontal = true;
        return this.isHorizontal = false;
    }

    giveIntervalEntry(){
        let min = Infinity;
        let max = -Infinity;
        let isHorizontal = this.is_parallel_entry_horizontal();
        for (let edge of this.entry){
            console.log("edge in giveInterval :", edge);
            if (isHorizontal){
                if (edge[0].x > max) max = edge[0].x;
                if (edge[0].x < min) min = edge[0].x;
                if (edge[1].x > max) max = edge[1].x;
                if (edge[1].x < min) min = edge[1].x;
            }else {
                if (edge[0].y > max) max = edge[0].y;
                if (edge[0].y < min) min = edge[0].y;
                if (edge[1].y > max) max = edge[1].y;
                if (edge[1].y < min) min = edge[1].y;
            }
        }
        if (isHorizontal){
            let y = this.entry[0][0].y;
            this.intervals = [new Point(min,y), new Point(max, y)];
            return [min,max,y]; 
        }else {
            let x = this.entry[0][0].x;
            this.intervals = [new Point(x,min), new Point(x, max)];
            return [min,max,x]; 
        }
    }

     // Return true if the doors are parallels (if all the points of the doors have the same x or y coordinates).
    are_doors_parallel(){
        if ((this.doors[0][0].x == this.doors[0][1].x && this.doors[1][0].x == this.doors[1][1].x )||
            (this.doors[0][0].y == this.doors[0][1].y && this.doors[1][0].y == this.doors[1][1].y)){
                return true;}
        return false;// Return false if the doors are orthogonal
    }

    getVertical(){
        console.log("getVertical ");
        this.isHorizontal = false;
        let vertical = [];
        let x;
        for (let edge of this.entry){
            if (edge[0].x == edge[1].x) {
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
        this.intervals = [new Point(min,x), new Point(max, x)];
        return [min,max,x];
    }

    getHorizontal(){
        console.log("getHorizontal ");
        this.isHorizontal = true;
        let horizontal = [];
        let y;
        for (let edge of this.entry){
            if (edge[0].y == edge[1].y) {
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
        this.intervals = [new Point(min,y), new Point(max, y)];
        return [min,max,y];
    }


    // Check if the orthogonal doors are the special case needing an endpoint
    needs_end_point(){
        if (this.orientation && this.horizontalEntries.length == 0 ) return true;
        else if (!this.orientation && this.verticalEntries.length == 0) return true;
        return false;
    }
}