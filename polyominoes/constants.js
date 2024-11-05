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
      this.visibility
  }

  draw() {
      // Draw the square with default color white and black edges
      fill(this.active ? 'red' : 'white'); // Fill color changes to red when active
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
