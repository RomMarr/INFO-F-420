// Variables
var polyomino = [];  // squares showed on the screen
var guards = [];    // guards to draw
var entriess = [];  // entries to draw
var doorss = [];    // doors to draw
var gridSize = 50; // Size of each square in the grid
var resetClick = false;     // true if the reset button is clicked
var validateClick = false;  // true if the validate button is clicked
var end = false;            // true if the program is done
var showDetails = false;    // true if the show details button is clicked
var resultMessage = ""; // Variable that holds the result message

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

    // Create the show details button -> show the gates
    const buttonShowDetails = createButton("Details");
    buttonShowDetails.position(130, 50);
    buttonShowDetails.mousePressed(changeDetails);
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
    end = false;
    resetClick = true;
    validateClick = false;
    showDetails = false;
    resultMessage = ""; // Clear the result message when resetting
}

function changeDetails() {
    if (guards.length > 1) showDetails = !showDetails;
    else resultMessage = "Details needs at least 2 guards to be shown";
}

// Start -> launch the disruptive solver and check if the polyomino is valid
function validate() {
    if (validateClick) return;
    resultMessage = ""; // Update message
    validateClick = true;
    end = true;
    poly = new Polyomino(polyomino);
    if (!poly.isValid()) {  // check if the polyomino is valid
        resultMessage = "The polyomino is invalid"; 
    }else{ resultMessage = ""; 
    polyomino = poly.getSquares();
    poly.start(true); // Prepare the main polyomino
    guards.push(poly.guards[0]); // Add the first guard to guards to draw
    disruptiveSolver(poly);
    poly.guards = guards;
    }
}

// Draw the view and the grid
function draw() {
    drawWindow(polyomino, resultMessage, guards, showDetails);
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