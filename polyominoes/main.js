// Variables
var polyomino = [];
var guards = [];
var entriess = [];
var doorss = [];
var gates = [];
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
    buttonClear.mousePressed(reset);

    // Create the validate button
    const buttonValidate = createButton("Validate");
    buttonValidate.position(60, 50);
    buttonValidate.mousePressed(validate);
}

// Function to create a grid of squares
function createGrid() {
    polyomino = []; // Reset the squares array
    const startX = 10; // Starting X position of the grid
    const startY = 75; // Starting Y position of the grid
    const cols = Math.floor((width - 20) / gridSize); // Calculate number of columns
    const rows = Math.floor((height - 200) / gridSize); // Calculate number of rows

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            polyomino.push(new Square(startX + col * gridSize, startY + row * gridSize, gridSize));
        }
    }
}

// Handle the reset button click
function reset() {
    createGrid()  // Reset all squares
    guards = [];
    entriess = [];
    doorss = [];
    gates = [];
    end = false;
    resetClick = true;
    validateClick = false;
    resultMessage = ""; // Clear the result message when resetting
}

// Start -> launch the disruptive solver and check if the polyomino is valid
function validate() {
    resultMessage = ""; // Update message
    validateClick = true;
    end = true;
    poly = new Polyomino(polyomino);
    if (!poly.isValid()) {  // check if the polyomino is valid
        resultMessage = "The polyomino is invalid"; 
    }else{ resultMessage = ""; 
    polyomino = poly.getSquares();
    poly.start(true); // Prepare the main polyomino
    guards.push(poly.guards[0]); // Add the first guard
    disruptiveSolver(poly);
    }
}

// Draw the view and the grid
function draw() {
    drawWindow(polyomino, resultMessage, guards);
}
// Action when the mouse is pressed
function mousePressed() {
  if (resetClick) {
      resetClick = false;
      return;
  }
  // Check if the point is inside any square
  for (let square of polyomino) {
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
