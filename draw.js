// Draw the view and the points/lines
function drawWindow(polygon, resultMessage) {
  background(200);
  // Draw the title and button section
  fill("black");
  text("Creation of a polygon", 10, 40);
  // Draw the clickable area for new points
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area
  // Draw the points
  drawPoints(polygon);
  drawPolygon(polygon);
  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}

// Draw the points and change their color if they are extreme points
function drawPoints(polygon) {
  for (let i = 0; i < polygon.length; i++) {
    fill("black"); // other points are in black
    ellipse(polygon[i].x, polygon[i].y, 10, 10);
  }
}

function drawPolygon(polygon) {
  if (polygon.length > 1) {
    for (let i = 1; i < polygon.length; i++) {
      let p1 = polygon[i - 1];
      let p2 = polygon[i];
      fill("black");
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
  if (polygon.length > 2) {
    let n = polygon.length - 1;
    fill("black");
    line(polygon[0].x, polygon[0].y, polygon[n].x, polygon[n].y);
  }
}