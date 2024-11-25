// Compare two edges together and returns true if they are the same
function compareEdges(edge1, edge2) {
  return (
    edge1[0].x === edge2[0].x &&
    edge1[0].y === edge2[0].y &&
    edge1[1].x === edge2[1].x &&
    edge1[1].y === edge2[1].y
  );
}

// Compare two edges together and returns true if they are the same or in reverse
function compareEdgesNonDirection(edge1, edge2) {
  return (
    edge1[0].x === edge2[0].x &&
    edge1[0].y === edge2[0].y &&
    edge1[1].x === edge2[1].x &&
    edge1[1].y === edge2[1].y ||
    edge1[0].x === edge2[1].x &&
    edge1[0].y === edge2[1].y &&
    edge1[1].x === edge2[0].x &&
    edge1[1].y === edge2[0].y
  );
}

// Check if an edge is in the list of edges
function compareEdgeList(edge,list){
  let reverse_edge = [edge[1],edge[0]];
  for (let edge_l of list){
    // if the edge is in the list
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

// Check if a point exists in an array
function pointExistsInArray(point, array) {
  return array.some(p => p.x === point.x && p.y === point.y);
}

// Check if two edges are adjacent (share one point)
function edgeAdjacent(edge1, edge2) {
  if (compareEdges(edge1, edge2)) return false; // if the edges are the same
  for (vertex1 of edge1){
    for (vertex2 of edge2){
      if (vertex1.x == vertex2.x && vertex1.y == vertex2.y) return true; // if the edges share a point
    }
  } return false;
}

// Create a rectangle from 2 points
function getRectangle(p,q){
  const min_x = Math.min(p.x, q.x);
  const max_x = Math.max(p.x, q.x);
  const min_y = Math.min(p.y, q.y);
  const max_y = Math.max(p.y, q.y);
  return [min_x,min_y,max_x,max_y];
}

// Check if 2 points are the same
function comparePoints(point1,point2){
  return point1.x == point2.x && point1.y == point2.y;
}

// Add two points together
function additionPoints(point1, point2){
  let x = point1.x + point2.x;
  let y = point1.y + point2.y;
  return new Point(x, y);
}

// Check if the point is in the list of edges
function isPointInEdges(point, list_edges){
  for (let edge of list_edges){
    for (let edge_point of edge){
      if (comparePoints(point, edge_point)) return true; // if the point is in the list
    }
  } return false;
}

// Check if the point is in the list of points
function commonCoordonate(point, list_points){
  for (let p of list_points){
    if (p.x == point.x || p.y == point.y) return true; // if the point is in the list
  } return false;
}