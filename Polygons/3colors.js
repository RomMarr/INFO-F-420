// creates the list of neighbors of a vertex considering the triangulation
function getVertexAdjacency(triangles) {
  const adjacencyList = points.map(() => []); 

  for(let triangle of triangles) {
    for (let i = 0; i < 3; i++) {
      const v1 = triangle[i];
      const v2 = triangle[(i + 1) % 3];
      const v3 = triangle[(i + 2) % 3];

      let index1 = points.indexOf(v1);
      let index2 = points.indexOf(v2);
      let index3 = points.indexOf(v3);

      if (index1 !== -1 && index2 !== -1 && index3 !== -1) {
          if (!adjacencyList[index1].includes(index2)) adjacencyList[index1].push(index2);
          if (!adjacencyList[index1].includes(index3)) adjacencyList[index1].push(index3);
          if (!adjacencyList[index2].includes(index1)) adjacencyList[index2].push(index1);
          if (!adjacencyList[index2].includes(index3)) adjacencyList[index2].push(index3);
          if (!adjacencyList[index3].includes(index1)) adjacencyList[index3].push(index1);
          if (!adjacencyList[index3].includes(index2)) adjacencyList[index3].push(index2);
      }
    }
  }
  return adjacencyList;
}
  
  


// Function to check if the current color assignment is valid
function isValidColoring(points, neighborsList, pointIndex, color) {
    for (const neighborIndex of neighborsList[pointIndex]) {
        if (points[neighborIndex].color === color) {
            return false;
        }
    }
    return true;
}

// Recursive function to color each point
function colorPoints(points, neighborsList, pointIndex = 0) {
  if (pointIndex === points.length) return true; // all the points are colored

  // try every color
  for (const color of COLORS) {
      // check if its neighbors have the same color
      if (isValidColoring(points, neighborsList, pointIndex, color)) {
          points[pointIndex].color = color;
          if (colorPoints(points, neighborsList, pointIndex + 1)) return true;
          points[pointIndex].color = "black";
      }
  }
  return false; // no coloring was found
}



function colorVerticesFromTriangles(triangles) {
  const vertexAdjacency = getVertexAdjacency(triangles);  // create the adjacency list
  colorPoints(points, vertexAdjacency); 
  // count the number of each color
  const counts = { red: 0, blue: 0, green: 0 };
  for (let point of points) counts[point.color]++;
  // choose the smallest set
  let minColor = "red";
  if (counts.blue < counts[minColor]) minColor = "blue";
  if (counts.green < counts[minColor]) minColor = "green";

  // make only the positions of the guards visible
  points.forEach(point => {
    if (point.color !== minColor) point.color = "black";
  });

  resultMessage = `${counts[minColor]} guards are needed to guard the gallery`;
}