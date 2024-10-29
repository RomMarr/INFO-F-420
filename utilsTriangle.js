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

// Check if 4th point is in the triangle of the 3 other points
function isInTriangle(p1, p2, p3, p4) {
  const orient1 = orient(p1, p2, p4);
  const orient2 = orient(p2, p3, p4);
  const orient3 = orient(p3, p1, p4);

  if (orient1 == orient2 && orient1 == orient3 && orient1 != Straight) {
    return true;
  }
  if (orient1 == Straight) {
    return isInTriangleLine(p1, p2, p4);
  }
  if (orient2 == Straight) {
    return isInTriangleLine(p2, p3, p4);
  }
  if (orient3 == Straight) {
    return isInTriangleLine(p3, p1, p4);
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

// Function that check which points are extreme points
function getExtremPoints() {
  for (let p of points) {
    p.isExtreme = true;
  } // Find extreme points
  for (let a of points) {
    for (let b of points) {
      for (let c of points) {
        for (let d of points) {
          if (a != b && a != c && a != d && b != c && b != d && c != d) {
            if (isInTriangle(b, c, d, a)) {
              a.isExtreme = false; // Mark the point as not an extreme point
            }
          }
        }
      }
    }
  }
  return fillingConvexHull();
}

// Fill the convexHull with all the extreme points
function fillingConvexHull() {
  let convexHull = [];
  for (p in points) {
    if (points[p].isExtreme) {
      if (convexHull.indexOf(points[p]) == -1) convexHull.push(points[p]);
    }
  }
  return convexHull;
}

// Check if a is greater than b or not with the determinant
function radially(a, b) {
  return calculateDet(a, convexHull[0], b);
}
