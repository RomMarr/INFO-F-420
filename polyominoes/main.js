// Variables
var squares = [];
var gridSize = 50; // Size of each square in the grid
var resetClick = false;
var validateClick = false;
var end = false;
var resultMessage = ""; // Variable to hold the result message

// Set up the window and its buttons
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize the squares
  for (let col = 0; col < Math.floor(width / gridSize); col++) {
    for (let row = 0; row < Math.floor((height - 150) / gridSize); row++) {
      squares.push(new Square(col * gridSize, row * gridSize + 75, gridSize));
    }
  }

  // Create the clear button
  const buttonClear = createButton("Clear");
  buttonClear.position(10, 50);
  buttonClear.mousePressed(resetPoints);

  // Create the validate button
  const buttonValidate = createButton("Validate");
  buttonValidate.position(60, 50);
  buttonValidate.mousePressed(validate);
}

// Handle the reset button click
function resetPoints() {
  // Reset all squares
  squares.forEach(square => square.active = false);
  end = false;
  resetClick = true;
  validateClick = false;
  resultMessage = ""; // Clear the result message when resetting
}

// Start -> handle triangulation & check intersections (collisions)
function validate() {
  // Placeholder for collision checking
  resultMessage = "Polyomino: valid -> ok"; // Update message
  validateClick = true;
  end = true;
}

// Draw the view and the grid
function draw() {
  drawWindow(squares, resultMessage);
}

// Handle a click from the mouse
function mousePressed() {
  if (resetClick) {
    resetClick = false;
    return;
  }

  // Check if the point is inside any square
  for (let square of squares) {
    if (square.isInside(mouseX, mouseY - 75)) { // Adjust for button area
      square.toggle(); // Toggle the square's active state
      break; // Exit the loop after toggling one square
    }
  }
}
