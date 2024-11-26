// Draw the view and the square
function drawWindow(squares, resultMessage, guards, showDetails) {
  background(200);

  // Draw the title and button section
  fill("black");
  textSize(24);
  text("Dispersive Art Gallery in polyominoes", 10, 30); // Title of the window

  // Draw the clickable area for the square
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area

  // draw the information for polyominoes
  drawGrid(squares); // Draw the grid of squares
  if (showDetails){
    drawDoors();
    drawEntry();
  } drawGuards(guards);

  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}


// Draw the squares (currently only one)
function drawGrid(squares){
  for (let square of squares)  square.draw(); // Call the draw method of each square
}


// Draw lines for the doors in orange
function drawDoors(){
  stroke("orange");
  strokeWeight(3); // Make the lines thicker
  if (doorss.length > 0) {
    for (let door of doorss) line(door[0].x, door[0].y, door[1].x, door[1].y);  // Draw a line at the door position
  } resetStroke();
}


// Draw lines for the entries in green
function drawEntry(){
  stroke("green");
  strokeWeight(3); // Make the lines thicker
   if (entriess.length > 0) {
    for (let entry of entriess) line(entry[0].x, entry[0].y, entry[1].x, entry[1].y);  // Draw a line at the entry position
  }resetStroke();
}


// Draw guards on the squares in prurple
function drawGuards(guards){
  if (guards.length > 0) {
    for (let guard of guards) guard.draw(); // Call the draw method of each guard
  }
}


function resetStroke(){
  strokeWeight(1); // Reset to default thickness
  stroke("black"); // Reset to default color
}


