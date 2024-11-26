// Variables
var points = [];
var ears = []; // triangles for the triangulation
// boolean variables
var resetClick = false;
var validateClick = false;
var end = false;
var TitleMessage = "Art Gallery Problem";
var resultMessage = ""; // Variable to hold the result message


// Set up the window and its button
function setup() {
  // On calcule la position pour centrer le canvas
  let canvasWidth = windowWidth * 0.8; // largeur du canvas (80% de la fenêtre)
  let canvasHeight = windowHeight * 0.8; // hauteur du canvas (80% de la fenêtre)

  // Créer le canvas et le positionner au centre
  let canvas = createCanvas(canvasWidth, canvasHeight);
  background(255);
  canvas.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);
  windowResized();

  // Création des boutons comme précédemment
  const buttonClear = createButton("Clear");
  buttonClear.position(10, 50);
  buttonClear.mousePressed(resetpoints);

  const buttonAGP = createButton("Solve");
  buttonAGP.position(60, 50);
  buttonAGP.mousePressed(validate);

  // Set text properties
  textSize(40);
  fill("black");
}

// Handle de resetButton clicked
function resetpoints() {
  points = [];
  ears = [];
  end = false;
  resetClick = true;
  validateClick = false;
  resultMessage = ""; // Clear the result message when resetting
}


function validate() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else {
    pts = points.slice(); // Copy the list of points
    pts = ensureCounterClockWise(pts); // Check list order
    ears = triangulate(pts); // Find the triangulation of the polygon

    // Color vertices after triangulation
    colorVerticesFromTriangles(ears);
  }
  validateClick = true;
  end = true;
}

// Draw the view and the points/lines
function draw() {
  drawWindow(points, ears, resultMessage);
}

// Handle a click from the mouse
function mousePressed() {
  if (resetClick) {
    resetClick = false;
    return;
  }
  if (
    // Only register clicks in the clickable area
    mouseY >= 75 &&
    mouseY <= height - 150 &&
    mouseX >= 10 &&
    mouseX <= width - 20
  ) {
    // if polygon has been confirmed
    if (validateClick == true) {
      return;
    } 
    else addPoint(); // add normal point
  }
}

// Handle the adding of new points
function addPoint() {
  points.push(new Point(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Redimensionne le canvas à la taille de la fenêtre
}
