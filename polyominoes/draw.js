// Draw the view and the square
function drawWindow(squares, resultMessage, guards) {
  background(200);

  // Draw the title and button section
  fill("black");
  textSize(24);
  text("Clickable Square Example", 10, 30); // Title of the window

  // Draw the clickable area for the square
  fill(255); // White color for the clickable area
  rect(10, 75, width - 20, height - 200); // Draw a rectangle for the clickable area

  // Draw the squares (currently only one)
  for (let square of squares) {
    square.draw(); // Call the draw method of each square
  }

  // Draw guards on the squares in blue
  if (guards.length > 0) {
    for (let guard of guards) {
      guard.draw(); // Call the draw method of each guard
    }
  }

  // Draw points for entries in orange
  if (entriess.length > 0) {
    //console.log("ent", entriess);
    for (let entry of entriess) {
      for (let p of entry){
        fill("green");
        ellipse(p.x, p.y,10,10);  // Draw a point at the door position
      }
    }
  }

  // Draw points for doors in green
  if (doorss.length > 0) {
    //console.log("doors", doorss);
    for (let door of doorss) {
      for (let p of door){
        fill("orange");
        ellipse(p.x, p.y,5, 5);  // Draw a point at the door position
      }
      
    }
    setTimeout(() => {
      console.log("3 seconds have passed");
    }, 100000);
  }

  // Draw the result message section
  fill("black");
  textSize(20);
  text(resultMessage, 30, height - 70); // Draw the result message at the bottom
}
