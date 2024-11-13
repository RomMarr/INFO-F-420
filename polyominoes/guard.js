class Guard{
    constructor(position){
        this.position = position;
        this.visibility;
    }

    get_position(){
        return this.position;
    }

    add_visibility(polyomino){
        this.visibility = polyomino;
    }

    draw(){
        fill("purple"); // Guard color
        ellipse(this.position.x, this.position.y, 10, 10); // Draw a blue dot at the center
    }
}