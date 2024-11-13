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
    }

    add_doors(doors){
        this.doors = doors;
    }
    change_orientation(orientation){
        this.orientation = orientation;
    }
}