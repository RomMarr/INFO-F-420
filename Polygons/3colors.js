// Rebuild adjacency list for vertices based on triangulation result
function getVertexAdjacency(triangles) {
    const adjacencyList = points.map(() => []);

    // Traverse each triangle and add adjacent vertices to each vertex in the triangle
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
        }
      }
    });
    let length = points.length;
    for (let i=0; i<length; i++) {
        let p = points[i];
        let precedent = points[((i-1)+length)%length];
        let suivant = points[(i+1)%length];
        let index1 = points.indexOf(p);
        let index2 = points.indexOf(precedent);
        let index3 = points.indexOf(suivant);
        if (index1 !== -1 && index2 !== -1 && index3 !== -1) {
            if (!adjacencyList[index1].includes(index2)) adjacencyList[index1].push(index2);
            if (!adjacencyList[index1].includes(index3)) adjacencyList[index1].push(index3);
        }
    }


    for (let i=0; i<length; i++)  adjacencyList[i].sort((a, b) => a - b)
    console.log(adjacencyList);
    return adjacencyList;
  }
  
  
// Assign color to a single vertex ensuring no two connected vertices share the same color
function assignColor(point, index, adjacencyList) {
    let usedColors = new Set();
    usedColors.add("black");
  
    // Récupère les couleurs des voisins
    adjacencyList[index].forEach(adjIndex => {
      const adjacentPoint = points[adjIndex];
      if (adjacentPoint.color) {
        usedColors.add(adjacentPoint.color);
      }
    });
  
    // Assigne la première couleur disponible qui n'est pas utilisée par les voisins
    for (let color of COLORS) {
      if (!usedColors.has(color)) {
        point.color = color;
        return; // Sort dès qu'une couleur est assignée
      }
    }
  }
  

  // Colorie tous les sommets du graphe de manière à ce que chaque sommet ait une couleur
  function colorVerticesFromTriangles(triangles) {
    const vertexAdjacency = getVertexAdjacency(triangles);
  
    // Utilise BFS pour colorier les sommets de manière continue
    let queue = [0]; // Commence avec le premier point
    points[0].color = COLORS[0]; // Assigne la première couleur au premier point
  

    while (queue.length > 0) {
        const currentIndex = queue.shift(); // Retire le premier élément de la file
        //const currentPoint = points[currentIndex];

    // Parcourt chaque voisin de currentIndex
    for (let i = 0; i < vertexAdjacency[currentIndex].length; i++) {
        const adjIndex = vertexAdjacency[currentIndex][i];
        const adjacentPoint = points[adjIndex];

        // Assigne une couleur si le voisin n'en a pas encore
        if (adjacentPoint.color == "black") {
            assignColor(adjacentPoint, adjIndex, vertexAdjacency);
            queue.push(adjIndex); // Ajoute le voisin à la file pour continuer le coloriage
        }
    }
    }
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