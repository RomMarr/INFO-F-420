// Check if point q is inside the polygon, if not link it with tangents to the polygon
function isInsidePolugon(q, convexHull) {
  // Look for the change in LeftRight turns
  let i = binarySearch(1, convexHull.length - 2, leftRight);
  let p0 = convexHull[0];
  let p1 = convexHull[i];
  let p2 = convexHull[(i + 1) % convexHull.length];
  if (isInTriangle(p0, p1, p2, q)) return "INSIDE";
  else {
    // Getting the tangents
    let chCopied = convexHull.slice(); // copy of convexHull to be sorted radially from q
    chCopied.sort(radiallyQ);
    tangents.push(chCopied[0]); // first one
    tangents.push(chCopied[convexHull.length - 1]); // second one
    return "OUTSIDE";
  }
}

// BinarySearch (dichotomic) with function f given (should return true or false)
function binarySearch(a, b, f) {
  // Code inspired by the code from wikipedia : Binary search
  if (f(b)) return b;
  while (a < b) {
    let i = floor((a + b) / 2); // middle
    let currentValue = f(i);
    let nextValue = f(i + 1);
    if (currentValue != nextValue) return i; // the change in the list has occured
    if (currentValue) a = i + 1;
    else b = i;
  }
  return a;
}

// Check if p0->pi->q is a LeftTurn or not
function leftRight(i) {
  let p0 = convexHull[0];
  let pi = convexHull[i];
  let q = qPoints[0];
  if (orient(p0, pi, q) == LeftTurn) return true;
  return false;
}

// Sort radially from the qPoint and not convexHull[0]
function radiallyQ(a, b) {
  return calculateDet(a, qPoints[0], b);
}
