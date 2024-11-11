// Draw the view and the square
function drawWindow(squares, resultMessage, guards) {
  background(200);

  // Draw the title and button section
  fill("black");
  textSize(24);
  text("Clickable Square Example", 10, 30); // Title of the window

  // Draw the clickable area for the square
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area

  // Draw the squares (currently only one)
  for (let square of squares) {
      square.draw(); // Call the draw method of each square
  }

   // Draw guards on the squares in blue
   if (guards.length > 0){
    for (let guard of guards) {
      fill("purple"); // Guard color
      ellipse(guard.x, guard.y, 10, 10); // Draw a blue dot at the center
   }
   
}

  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}