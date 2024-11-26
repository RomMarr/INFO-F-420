// Variables
var points = [];
var ears = []; // triangles for the triangulation
// arrays for the geodesic distance
var path = [];
var pointDist = [];
// boolean variables
var resetClick = false;
var validateClick = false;
var end = false;
var createPolygon = false;
var showPath = false;
var resultMessage = ""; // Variable to hold the result message

// Set up the window and its button
function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create the clear button
  const buttonClear = createButton("Clear");
  buttonClear.position(10, 50);
  buttonClear.mousePressed(resetpoints);
// Create the validate button AGP
  const buttonAGP = createButton("AGP");
  buttonAGP.position(60, 50);
  buttonAGP.mousePressed(validate);
  // Create the validate button for DAGP
  const buttonDAGP = createButton("DAGP");
  buttonDAGP.position(110, 50);
  buttonDAGP.mousePressed(solveDAGP);

  // Create the validate button for DAGP
  const buttonGeodesicDist = createButton("Geodesic Distance");
  buttonGeodesicDist.position(170, 50);
  buttonGeodesicDist.mousePressed(creatingPolygon);

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

function creatingPolygon() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else {
    createPolygon = true;
    console.log("Creating polygon");
    let pts = points.slice(); // Copie de la liste de points
    pts = ensureCounterClockWise(pts); // Vérification de l'ordre
    ears = triangulate(pts); // Calcul de la triangulation
    resultMessage = "Choose two points to calculate the geodesic distance";

  }
}


function validate() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else {
    pts = points.slice(); // Copy the list of points
    pts = ensureCounterClockWise(pts); // Check list order
    triangulate(pts); // Find the triangulation of the polygon

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
    if (createPolygon == true) {
      pointDist.push(new Point(mouseX, mouseY));
      if (pointDist.length!=0 && (pointDist.length % 2)==0) {
          calculateGeodesicDistance(pointDist[pointDist.length - 2], pointDist[pointDist.length - 1], ears);
          showPath = true;
      }
  }
    // if polygon has been confirmed
    else if (validateClick == true) {
      return;
    } 
    else addPoint(); // add normal point
  }
}

// Handle the adding of new points
function addPoint() {
  points.push(new Point(mouseX, mouseY));
}
