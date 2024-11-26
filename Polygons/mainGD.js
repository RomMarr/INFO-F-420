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
var createdPolygon = false;
var showPath = false;
var TitleMessage = "Geodesic Distance";
var resultMessage = ""; // Variable to hold the result message


// Set up the window and its button
function setup() {
  // On calcule la position pour centrer le canvas
  let canvasWidth = windowWidth * 0.8; // largeur du canvas (80% de la fenêtre)
  let canvasHeight = windowHeight * 0.8; // hauteur du canvas (80% de la fenêtre)

  // Créer le canvas et le positionner au centre
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);
  windowResized();

  // Création des boutons comme précédemment
  const buttonClear = createButton("Clear");
  buttonClear.position(10, 50);
  buttonClear.mousePressed(resetpoints);

  const buttonGeodesicDist = createButton("Find distance");
  buttonGeodesicDist.position(70, 50);
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
  createdPolygon = false;
  showPath = false;
  resultMessage = ""; // Clear the result message when resetting
}

function creatingPolygon() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else {
    createdPolygon = true;
    let pts = points.slice(); // Copie de la liste de points
    pts = ensureCounterClockWise(pts); // Vérification de l'ordre
    ears = triangulate(pts); // Calcul de la triangulation
    resultMessage = "Choose two points to calculate the geodesic distance";

  }
}



// Draw the view and the points/lines
function draw() {
  drawWindow(points, ears, resultMessage);
  drawPath();
  drawPointForDistance(pointDist);
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
    if (createdPolygon == true) {
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Redimensionne le canvas à la taille de la fenêtre
}


