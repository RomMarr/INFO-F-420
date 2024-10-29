// Draw the view and the points/lines
function drawWindow(points, ears, resultMessage) {
  background(200);
  // Draw the title and button section
  fill("black");
  text("Triangulation on simple polygon", 10, 40);
  // Draw the clickable area for new points
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area
  // Draw the points
  drawPoints(points);
  drawPolygon(points);
  drawEars(ears);
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

// Draw the lines between each extreme points
function drawConvexHull(convexHull) {
  if (convexHull.length >= 2) {
    for (let i = 1; i < convexHull.length; i++) {
      fill("red");
      line(
        convexHull[i - 1].x,
        convexHull[i - 1].y,
        convexHull[i].x,
        convexHull[i].y
      );
    } // draw the line between the first and last extreme point
    line(
      convexHull[0].x,
      convexHull[0].y,
      convexHull[convexHull.length - 1].x,
      convexHull[convexHull.length - 1].y
    );
  }
}

// Draw the tangents from q to its extreme points if q is outside
function drawTan(resultMessage) {
  if (resultMessage == "OUTSIDE" && tangents.length == 2) {
    let t1 = tangents[0];
    let t2 = tangents[1];
    let q = qPoints[0];
    fill("black");
    line(t1.x, t1.y, q.x, q.y); // draw tangent 1 to q
    line(t2.x, t2.y, q.x, q.y); // draw tangent 2 to q
  }
}

// Draw the lines to create the triangulation of the simple polygon
function drawEars(ears) {
  let n = ears.length;
  for (let i = 0; i < n; i++) {
    // each ear
    for (let j = 1; j <= 3; j++) {
      // each point of the ear
      fill("black");
      line(
        ears[i][j - 1].x,
        ears[i][j - 1].y,
        ears[i][j % 3].x,
        ears[i][j % 3].y
      );
    }
  }
}
