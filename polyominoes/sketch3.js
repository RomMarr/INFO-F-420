new p5((p) => {
    let polyomino = [];
    let guards = [];
    let gridSize = 50;
    let resultMessage = "";
  
    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth - 40, 400);
      canvas.parent("sketch1");
      createGrid();
  
      const buttonClear = p.createButton("Clear");
      buttonClear.parent("sketch1");
      buttonClear.mousePressed(reset);
  
      const buttonValidate = p.createButton("Validate");
      buttonValidate.parent("sketch1");
      buttonValidate.mousePressed(validate);
    };
  
    p.draw = () => {
      drawWindow(polyomino, resultMessage, guards, p);
    };
  
    function createGrid() {
      polyomino = [];
      const cols = Math.floor((p.width - 20) / gridSize);
      const rows = Math.floor((p.height - 200) / gridSize);
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          polyomino.push(new Square(10 + col * gridSize, 75 + row * gridSize, gridSize));
        }
      }
    }
  
    function reset() {
      createGrid();
      guards = [];
      resultMessage = "";
    }
  
    function validate() {
      resultMessage = "Validation logic goes here.";
    }
  
    p.mousePressed = () => {
      for (let square of polyomino) {
        if (square.isInside(p.mouseX, p.mouseY)) {
          square.toggle();
          break;
        }
      }
    };
  
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth - 40, 400);
      createGrid();
    };
  });
  