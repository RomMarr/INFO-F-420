var RightTurn = "Right Turn";
var Straight = "Straight";
var LeftTurn = "Left Turn";

// Calculate the determinant of the 3 points
function calculateDet(p1, p2, p3) {
  const det =
    p1.x * p2.y -
    p1.x * p3.y -
    p1.y * p2.x +
    p1.y * p3.x +
    p2.x * p3.y -
    p2.y * p3.x;
  return -det; // -det because the Y-axis is inverted
}

// This determine the orientation from the determinant
function orient(p1, p2, p3) {
  const det = calculateDet(p1, p2, p3);
  if (det < 0) return RightTurn;
  else if (det > 0) return LeftTurn;
  else return Straight;
}

// check if a point is inside a triangle
function inTriangle(listPoints) {
  listDets = [];
  for (let i = 0; i < listPoints.length - 1; i++) {
    var det = calculateDet(listPoints[i], listPoints[(i + 1) % 3], listPoints[3]);
    listDets.push(det);
  }
  return isInsideTriangle(listDets);
}

function isInsideTriangle(listDets) {
  if (listDets.every((det) => det >= 0) || listDets.every((det) => det <= 0)) {
    return true;
  }
  return false;
}

// check if p3 is on the segment {p1, p2} or further than one of those points
function isInTriangleLine(p1, p2, p3) {
  const maxX = Math.max(p1.x, p2.x);
  const maxY = Math.max(p1.y, p2.y);
  const minX = Math.min(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  if (p3.x > maxX || p3.x < minX || p3.y > maxY || p3.y < minY) {
    return false;
  }
  return true;
}

// Check collision between segment a,b and segment c,d
function checkDetCollision(a, b, c, d) {
  let det1 = calculateDet(a, b, c);
  let det2 = calculateDet(a, b, d);
  let det3 = calculateDet(c, d, a);
  let det4 = calculateDet(c, d, b);
  if (det1 * det2 < 0 && det3 * det4 < 0) return true;
  return false;
}

// Handle the collison check for all the edges together
function checkCollision() {
  let edges = getEdges(points);
  for (let i = 0; i < edges.length; i++) {
    for (let j = 0; j < edges.length; j++) {
      // if not same edge
      if (i !== j) {
        // if they don't have the sames vertices
        if (!compareEdges(edges[i], edges[j])) {
          if (
            checkDetCollision(
              edges[i][0],
              edges[i][1],
              edges[j][0],
              edges[j][1]
            )
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Create a list of edges from the points
function getEdges(points) {
  const edges = [];
  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    const point2 = points[(i + 1) % points.length];
    edges.push([point1, point2]);
  }
  return edges;
}

// Compare two edges together and returns true if they are the same
function compareEdges(edge1, edge2) {
  return (
    edge1[0].x === edge2[0].x &&
    edge1[0].y === edge2[0].y &&
    edge1[1].x === edge2[1].x &&
    edge1[1].y === edge2[1].y
  );
}

// True if p1,p2,p3 are a left Turn
function isCounterClockwise(p1, p2, p3) {
  return calculateDet(p1, p2, p3) >= 0;
}

// Get the lower point of the polygon
function getLowerPoint(pts) {
  let lower = 0; // y-value
  let index = 0; // index in pts
  for (let i = 0; i < pts.length; i++) {
    // If multiples lower points, take the leftmost one
    if (pts[i].y > lower || (pts[i].y == lower && pts[i].x < pts[index].x)) {
      lower = pts[i].y;
      index = i;
    }
  }
  return index;
}

// Check that the lower point and the point before it and after make a LeftTurn
function checkCounterClockWise(pts) {
  let lowerP = getLowerPoint(pts);
  let prev = pts[(lowerP - 1 + pts.length) % pts.length];
  let curr = pts[lowerP];
  let next = pts[(lowerP + 1) % pts.length];
  // Check if triangle (prev, curr, next) is counter-clockwise
  if (isCounterClockwise(prev, curr, next)) return true;
  return false;
}

// Check if the polygon is in CCW and reverse it if not
function ensureCounterClockWise(pts) {
  if (!checkCounterClockWise(pts)) return pts.reverse();
  else return pts;
}

// Function to check if a triangle is an ear
function isEar(pts, i) {
  let prev = pts[(i - 1 + pts.length) % pts.length];
  let curr = pts[i];
  let next = pts[(i + 1) % pts.length];
  // Check if they are in the right order (ccw)
  if (orient(prev, curr, next) !== LeftTurn) return false;  // Check if no other point is inside the triangle
  for (let j = 0; j < pts.length; j++) {
    if (
      j !== i &&
      j !== (i - 1 + pts.length) % pts.length &&
      j !== (i + 1) % pts.length
    ) {
      if (inTriangle([prev, curr, next, pts[j]])) {
        return false;
      }
    }
  }

  return true;
}

// Recursive function to triangulate the polygon
function triangulate(pts) {
  if (pts.length == 3) {
    // Base case : the remaining vertices form the last triangle
    ears.push([pts[0], pts[1], pts[2]]);
    return;
  }
  // Find an ear
  for (let i = 0; i < pts.length; i++) {
    if (isEar(pts, i)) {
      let prev = pts[(i - 1 + pts.length) % pts.length];
      let curr = pts[i];
      let next = pts[(i + 1) % pts.length];

      // Add the ear triangle to the triangles list
      ears.push([prev, curr, next]);

      // Remove the current vertex (ear) from the polygon
      pts.splice(i, 1);

      // Recursively continue triangulation
      triangulate(pts);
      return;
    }
  }
}
