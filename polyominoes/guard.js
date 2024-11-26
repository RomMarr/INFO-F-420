class Guard{ // Guard class use to watch the polyomino
    constructor(position){
        this.position = position;
        this.visibility;
    }

    // Get the position of the guard
    getPosition(){
        return this.position;
    }

    // Add the visibility of the guard
    addVisibility(polyomino){
        this.visibility = polyomino;
    }

    // Draw the guard
    draw(){
        fill("purple"); // Guard color
        ellipse(this.position.x, this.position.y, 20, 20); // Draw a blue dot at the center
    }
}