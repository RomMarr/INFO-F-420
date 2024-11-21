class Square {
    constructor(x, y, size) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.active = false;
    }
  
    draw(p) {
      p.fill(this.active ? "blue" : "white");
      p.rect(this.x, this.y, this.size, this.size);
    }
  
    toggle() {
      this.active = !this.active;
    }
  
    isInside(x, y) {
      return x > this.x && x < this.x + this.size && y > this.y && y < this.y + this.size;
    }
  }
  