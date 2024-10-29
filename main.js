/* eslint-disable no-undef, no-unused-vars */

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isExtreme = true; // Mark extreme points
  }
}

// Variables
var points = [];
var resetClick = false;
var validateClick = false;
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
  const buttonValidate = createButton("Validate");
  buttonValidate.position(60, 50);
  buttonValidate.mousePressed(validate);
  // Set text properties
  textSize(40);
  fill("black");
}

// Handle de resetButton clicked
function resetpoints() {
  points = [];
  end = false;
  resetClick = true;
  validateClick = false;
  resultMessage = ""; // Clear the result message when resetting
}

// Start -> handle triangulation & check intersections (collisions)
function validate() {
  if (checkCollision()) {
    resultMessage = "COLLISION, create a simple polygon";
  } else resultMessage = "Polygon : simple -> ok";
  //convexHull = getExtremPoints();
  validateClick = true;
  end = true;
  //convexHull.sort(radially);
}

// Draw the view and the points/lines
function draw() {
  drawWindow(points, resultMessage);
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
    } else addPoint(); // add normal point
  }
}

// Handle the adding of new points
function addPoint() {
  points.push(new Point(mouseX, mouseY));
}
