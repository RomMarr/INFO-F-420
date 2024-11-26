// Variables
var polyomino = [];
var polyominoObject = null;
var pointDistance = [];
var path = [];
var gridSize = 50; // Size of each square in the grid
var resetClick = false;
var validateClick = false;
var end = false;
var calculateClick = false;
var resultMessage = ""; // Variable to hold the result message

// Set up the window and its buttons
function setup() {
    let canvasWidth = windowWidth * 0.8; // largeur du canvas (80% de la fenêtre)
    let canvasHeight = windowHeight * 0.8; // hauteur du canvas (80% de la fenêtre)
  
    // Créer le canvas et le positionner au centre
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.position((windowWidth - canvasWidth) / 2, (windowHeight - canvasHeight) / 2);
    windowResized();
    createGrid(); // Call the function to create the grid of squares

    // Create the clear button
    const buttonClear = createButton("Clear");
    buttonClear.position(10, 50);
    buttonClear.mousePressed(reset);

    const buttonDistance = createButton("calculate distance");
    buttonDistance.position(60, 50);
    buttonDistance.mousePressed(l1geodesicDistance);
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
    createGrid()  // Reset all squareClears
    end = false;
    resetClick = true;
    validateClick = false;
    pointDistance = []; // Clear the points
    calculateClick = false;
    path = []; // Clear the path
    resultMessage = ""; // Clear the result message when resetting
}


// Draw the view and the grid
function draw() {
    drawBackground("L1 Geodesic Distance", resultMessage);
    drawGrid(polyomino); // Draw the grid of squares
    if (pointDistance.length % 2 == 0 && pointDistance.length > 0) {
        for (let i = pointDistance.length-2; i < pointDistance.length; i++) {
            fill("black");
            ellipse(pointDistance[i].x, pointDistance[i].y, 10, 10);
        }
    }
    else if (pointDistance.length % 2 == 1) {
        fill("black");
        ellipse(pointDistance[pointDistance.length-1].x, pointDistance[pointDistance.length-1].y, 10, 10);
    }
}


// Action when the mouse is pressed
function mousePressed() {
  if (resetClick) {
      resetClick = false;
      return;
  }
    if (calculateClick && mouseX > 10 && mouseY > 75 && mouseX < width - 20 && mouseY < height - 200) {
        pointDistance.push({ x: mouseX, y: mouseY });
        if (pointDistance.length %2==0) {
            calculateDistance();
        }
    }
  // Check if the point is inside any square
  for (let square of polyomino) {
      // Adjust the mouse position based on the button area offset
      if (square.isInside(mouseX, mouseY) && !calculateClick) { 
          square.toggle(); // Toggle the square's active state
          break; // Exit the loop after toggling one square
      }
  }
}

// Adjust the grid when the window is resized
function windowResized() {
    createGrid(); // Recreate the grid of squares
}


function calculateDistance() {
    resultMessage = "Choose two points to calculate the distance";
    path = bfsL1GeodesicDistance(pointDistance[pointDistance.length-2], pointDistance[pointDistance.length-1], polyominoObject);
    showPath = true;
    let distance = path.length;
    for (let square of polyomino) {
        if (path.includes(square)) {
            square.inPath = true;
        }
        else {
            square.inPath = false;
        }
    }
}


function l1geodesicDistance() {
    resultMessage = ""; // Update message
    validateClick = true;
    end = true;
    polyominoObject = new Polyomino(polyomino);
    if (!polyominoObject.isValid()) {
        resultMessage = "Polyomino: invalid "; 
    }else{ resultMessage = "Polyomino: valid"; }
    polyomino = polyominoObject.getSquares();  // for the drawing
    calculateClick = true;
}


function bfsL1GeodesicDistance(p1, p2, polyomino) {
    const squares = polyomino.getSquares();
    // find the squares of the points
    const squareP1 = squares[polyomino.getSquareIndexAtPoint(p1)];
    const squareP2 = squares[polyomino.getSquareIndexAtPoint(p2)];

    const queue = [];
    const visited = new Set();

    // Initial Point
    queue.push({s: squareP1, path :[squareP1]});
    visited.add(squareP1);

    while (queue.length > 0) {
        const {s, path} = queue.shift();

        if (s === squareP2) { // if found the destination
            return path;
        }

        const neighbors = polyomino.getDirectNeighbors(s, squares);

        // Add all theneighbors to the queue
        for (let neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ s: neighbor, path:[...path, neighbor] });
            }
        }
    }

    return [];
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Redimensionne le canvas à la taille de la fenêtre
    createGrid();
}


