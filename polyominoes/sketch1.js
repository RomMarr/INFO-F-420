let canvas1;

function setup() {
  canvas1 = createCanvas(400, 300);
  canvas1.parent('sketch1'); // Attach to the correct div
  background(200);
}

function draw() {
  // Example interactive behavior
  if (mouseIsPressed) {
    fill(0);
    ellipse(mouseX, mouseY, 20, 20);
  }
}

document.getElementById('reset1').addEventListener('click', () => {
  background(200); // Reset canvas
});

document.getElementById('validate1').addEventListener('click', () => {
  alert('Validate Sketch 1!');
});
