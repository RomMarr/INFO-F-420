// Variables
var points = [];
var ears = []; // triangles for the triangulation
var path = [];
var pointDist = [];
var resetClick = false;
var validateClick = false;
var createPolygon = false;
var showPath = false;
var end = false;
var resultMessage = ""; // Variable to hold the result message

// Set up the window and its button
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the clear button
  const buttonClear = createButton("Clear");
  buttonClear.position(10, 50);
  buttonClear.mousePressed(resetpoints);
  // Create the validate button
  const buttonPolygon = createButton("Create");
  buttonPolygon.position(60, 50);
  buttonPolygon.mousePressed(solveDAGP);
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
  path = [];
  pointDist = [];
  createPolygon = false;
  showPath = false;
  resultMessage = ""; // Clear the result message when resetting
}


function validate() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else {
    createPolygon = true;
    let pts = points.slice(); // Copie de la liste de points
    pts = ensureCounterClockWise(pts); // Vérification de l'ordre
    ears = triangulate(pts); // Calcul de la triangulation

  }
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
    if (createPolygon == true) {
        pointDist.push(new Point(mouseX, mouseY));
        if (pointDist.length!=0 && (pointDist.length % 2)==0) {
            calculateGeodesicDistance(pointDist[pointDist.length - 2], pointDist[pointDist.length - 1], ears);
            showPath = true;
        }


    } else addPoint(); // add normal point
  }
}


// Handle the adding of new points
function addPoint() {
  points.push(new Point(mouseX, mouseY));
}
