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
    }
  
    draw() {
      // Draw the square
      fill(this.active ? 'lightgray' : 'lightgray'); // Default fill color
      stroke('black');
      rect(this.x, this.y, this.size, this.size);
  
      // If the square is active, draw its edges in red
      if (this.active) {
        stroke('red');
        noFill();
        rect(this.x, this.y, this.size, this.size);
      }
    }
  
    toggle() {
      this.active = !this.active; // Toggle the active state
    }
  
    isInside(px, py) {
      return px >= this.x && px <= this.x + this.size && py >= this.y && py <= this.y + this.size;
    }
  }