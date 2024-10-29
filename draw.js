// Draw the view and the points/lines
function drawWindow(points, resultMessage) {
  background(200);
  // Draw the title and button section
  fill("black");
  text("Creation of a polygon", 10, 40);
  // Draw the clickable area for new points
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area
  // Draw the points
  drawPoints(points);
  drawPolygon(points);
  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}

// Draw the points and change their color if they are extreme points
function drawPoints(points) {
  for (let i = 0; i < points.length; i++) {
    fill("black"); // other points are in black
    ellipse(points[i].x, points[i].y, 10, 10);
  }
}

function drawPolygon(points) {
  if (points.length > 1) {
    for (let i = 1; i < points.length; i++) {
      let p1 = points[i - 1];
      let p2 = points[i];
      fill("black");
      line(p1.x, p1.y, p2.x, p2.y);
    }
  }
  if (points.length > 2) {
    let n = points.length - 1;
    fill("black");
    line(points[0].x, points[0].y, points[n].x, points[n].y);
  }
}
