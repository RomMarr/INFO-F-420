// Draw the view and the points/lines
function drawWindow(points, ears, resultMessage) {
  background(129);
  // Draw the title and button section
  fill("black");
  text(TitleMessage, 10, 40);
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



// Draw the points and color each vertex based on the assigned color
function drawPoints(points) {
  for (let i = 0; i < points.length; i++) {
    fill(points[i].color); // Use assigned color or default to black if not colored
    ellipse(points[i].x, points[i].y, 10, 10);
  }
}

// if searching for the geodesic distance, draw the points
function drawPointForDistance(pointDist) {
  if(createPolygon) {
    for (let i = 0; i < pointDist.length; i++) {
      fill("black");
      ellipse(pointDist[i].x, pointDist[i].y, 10, 10);
    }
  }
}


// Draw the path between the two points
function drawPath() {
  if (showPath) {
      stroke("yellow"); 
      for (let i = 1; i < path.length; i++) {
          line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
      }
      stroke("black"); 
  }
}


// Draw the polygon based on the points
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
