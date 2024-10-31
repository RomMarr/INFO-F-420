// Draw the view, the squares, and the result message
function drawWindow(squares, resultMessage) {
  background(200);

  // Draw the title
  fill("black");
  textSize(24);
  text("Creation of a Polyomino", 10, 30);
  
  // Draw the clickable area for new squares (grid)
  const gridSize = 50; // Size of each square
  const gridColumns = Math.floor(width / gridSize);
  const gridRows = Math.floor((height - 150) / gridSize); // Space for buttons
  
  // Draw each square
  for (let i = 0; i < squares.length; i++) {
    squares[i].draw();
  }

  // Draw the result message section
  fill("red");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}
