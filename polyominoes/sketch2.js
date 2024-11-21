let canvas2;

function setup() {
  canvas2 = createCanvas(400, 300);
  canvas2.parent('sketch2'); // Attach to the correct div
  background(150);
}

function draw() {
  // Example interactive behavior
  fill(random(255), random(255), random(255));
  rect(mouseX, mouseY, 20, 20);
}

document.getElementById('reset2').addEventListener('click', () => {
  background(150); // Reset canvas
});

document.getElementById('validate2').addEventListener('click', () => {
  alert('Validate Sketch 2!');
});
