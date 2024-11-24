// Define the Point Class
class Point {
  constructor(x, y) {
      this.x = x;
      this.y = y;
  }
}

// Define the Square class
class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.active = false; // To track if the square is active (clicked)
        this.watched = false; // To track if the square is covered by a guard
        this.leftUpPt = new Point(x, y); // Top-left point
        this.rightUpPt = new Point(x + size, y); // Top-right point
        this.leftDownPt = new Point(x, y + size); // Bottom-left point
        this.rightDownPt = new Point(x + size, y + size); // Bottom-right point
        this.middle = new Point(x +size/2, y+size/2);
        this.corners = [this.leftUpPt, this.rightUpPt, this.rightDownPt, this.leftDownPt]; // Array of all corners
    }

  draw() {
      // Draw the square with default color white and black edges
      fill(this.active ? 'red' : 'white'); // Fill color changes to red when active
      if (this.watched) fill("blue");
      stroke('black'); // Edge color
      rect(this.x, this.y, this.size, this.size);
  }

  toggle() {
      this.active = !this.active; // Toggle the active state
  }

  isInside(px, py) {
      return px >= this.x && px <= this.x + this.size && py >= this.y && py <= this.y + this.size;
  }
}

class Gate{
    constructor(entry){
        this.entry = entry;  // edge(s) connecting the view of a guard and the subpolyomino
        this.doors;  // edges next to the entry -> can be [parallel, orthogonal]
        this.orientation; // true = clockwise and false = counter-clockwise
        this.intervals = [];
        this.isHorizontal;
    }

    add_doors(doors){
        console.log('we are in add doors, list of doors :', doors);
        this.doors = doors;
    }
    
    change_orientation(orientation){
        this.orientation = orientation;
    }

    isEntryHorizontal(){  
        console.log("Check constCoooordinatesIsHorizontal :", this.entry[0], "bool :", this.entry[0][0].y  == this.entry[0][1].y);
        if (this.entry[0][0].y  == this.entry[0][1].y) return this.isHorizontal = true;
        return this.isHorizontal = false;
    }

    giveIntervalEntry(){
        let min = 9999;
        let max = -9999;
        let isHorizontal = this.isEntryHorizontal();
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
        
    is_parrallel(){
        // Return true if the doors are parallels (if all the points of the doors have the same x or y coordinates).
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

    getPoint(incr){
        if (this.isHorizontal){
            if (incr.y < 0) {
                min = 9999;
                for (let edge of this.entry){
                    if (edge[0].y == this.intervals[0].y) return edge[0];
                }
            }
    }}
}
