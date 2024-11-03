// Draw the view and the square
function drawWindow(squares, resultMessage) {
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

  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}

// Note: The square drawing logic will still be managed by the Square class.
// You don't need to change the draw function in the Square class.
