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
    createGrid(); // Call the function to create the grid of squares

    // Create the clear button
    const buttonClear = createButton("Clear");
    buttonClear.position(10, 50);
    buttonClear.mousePressed(resetPoints);

    // Create the validate button
    const buttonValidate = createButton("Validate");
    buttonValidate.position(60, 50);
    buttonValidate.mousePressed(validate);
}

// Function to create a grid of squares
function createGrid() {
    squares = []; // Reset the squares array
    const startX = 10; // Starting X position of the grid
    const startY = 75; // Starting Y position of the grid
    const cols = Math.floor((width - 20) / gridSize); // Calculate number of columns
    const rows = Math.floor((height - 200) / gridSize); // Calculate number of rows

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            squares.push(new Square(startX + col * gridSize, startY + row * gridSize, gridSize));
        }
    }
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
    valid = areSquaresConnected(squares);
    if (!valid) {
        resultMessage = "Polyomino: invalid -> collision"; // Update message
    }else resultMessage = "Polyomino: valid -> ok"; // Update message
}

// Draw the view and the grid
function draw() {
    drawWindow(squares, resultMessage);
}

function mousePressed() {
  if (resetClick) {
      resetClick = false;
      return;
  }

  // Check if the point is inside any square
  for (let square of squares) {
      // Adjust the mouse position based on the button area offset
      if (square.isInside(mouseX, mouseY)) { 
          square.toggle(); // Toggle the square's active state
          break; // Exit the loop after toggling one square
      }
  }
}

// Adjust the grid when the window is resized
function windowResized() {
    createGrid(); // Recreate the grid of squares
}
