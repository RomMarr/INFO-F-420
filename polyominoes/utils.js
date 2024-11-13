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
  let edges = getEdges(polygon);
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
function getEdges(polygon) {
  const edges = [];
  for (let i = 0; i < polygon.length; i++) {
    const point1 = polygon[i];
    const point2 = polygon[(i + 1) % polygon.length];
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

function compare_edge_list(edge,list){
  let reverse_edge = [edge[1],edge[0]];
  for (let edge_l of list){
    if (compareEdges(edge_l, edge)|| compareEdges(edge_l, reverse_edge)) return true;
  }return false;
}

// Helper function to check if two arrays are equal
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].x !== arr2[i].x || arr1[i].y !== arr2[i].y) return false;
  }
  return true;
}

function pointExistsInArray(point, array) {
  return array.some(p => p.x === point.x && p.y === point.y);
}

function edge_adjacent(edge1, edge2) {
  if (compareEdges(edge1, edge2)) return false;
  for (vertex1 of edge1){
    for (vertex2 of edge2){
      if (vertex1.x == vertex2.x && vertex1.y == vertex2.y) return true;
    }
  } return false;
}

function getRectangle(p,q){
  const min_x = Math.min(p.x, q.x);
  const max_x = Math.max(p.x, q.x);
  const min_y = Math.min(p.y, q.y);
  const max_y = Math.max(p.y, q.y);
  return [min_x,min_y,max_x,max_y];
}

function compare_points(point1,point2){
  return point1.x == point2.x && point1.y == point2.y;
}

function is_point_in_edges(point, list_edges){
  for (let edge of list_edges){
    for (let edge_point of edge){
      if (compare_points(point, edge_point)) return true;
    }
  } return false;
}