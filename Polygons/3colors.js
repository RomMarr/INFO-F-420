// Fonction mise à jour pour construire la liste d'adjacence
function getVertexAdjacency(triangles) {
  const adjacencyList = points.map(() => []);

  triangles.forEach(triangle => {
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
  });
  return adjacencyList;
}
  
  
// List of available colors
const colors = ["red", "blue", "green"];

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
  if (pointIndex === points.length) return true; // Tous les points sont coloriés

  for (const color of colors) {
      if (isValidColoring(points, neighborsList, pointIndex, color)) {
          points[pointIndex].color = color; // Attribue la couleur

          if (colorPoints(points, neighborsList, pointIndex + 1)) return true;

          // Annule la couleur si cela ne fonctionne pas
          points[pointIndex].color = "black";
      }
  }
  return false; // Retourne si aucune couleur valide n'est trouvée
}


function colorVerticesFromTriangles(triangles) {
  const vertexAdjacency = getVertexAdjacency(triangles);
  colorPoints(points, vertexAdjacency); // Démarre de l'indice 0
}

  
  // Check if two triangles share an edge
//   function areTrianglesAdjacent(tri1, tri2) {
//     let sharedVertices = 0;
//     tri1.forEach(p1 => {
//       tri2.forEach(p2 => {
//         if (p1.x === p2.x && p1.y === p2.y) {
//           sharedVertices++;
//         }
//       });
//     });
//     return sharedVertices === 2; // Shared edge means two vertices in common
//   }