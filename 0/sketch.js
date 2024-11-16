let song;
let mFFT;
let wand;
let colorA, colorB, colorC;
let diamT = 0, diamM = 0, diamB = 0;
let moves = [];
let colorPicker;
let amplitude;
let ballScale = 50;

class Movey {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.scale = ballScale;
    this.color = color(random(100, red(colorPicker.color())), random(200, green(colorPicker.color())), random(100, blue(colorPicker.color())));
  }

  overlap(other) {
    if (other === this) return false;
    let dist = p5.Vector.dist(this.pos, other.pos);
    return dist < (this.scale / 2 * sin(frameCount) + other.scale / 2 * sin(frameCount));
  }

  updateAndDraw(others) {
    this.pos.add(this.vel);

    if (this.pos.x > width - this.scale || this.pos.x < this.scale) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height - this.scale || this.pos.y < this.scale) {
      this.vel.y *= -1;
    }

    let overlap = false;
    for (let other of others) {
      overlap |= this.overlap(other);
    }

    if (overlap) {
      this.color = color(random(100, red(colorPicker.color())), random(200, green(colorPicker.color())), random(100, blue(colorPicker.color())));
    }

    push();
    stroke(this.color, 200);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.scale / 2 * sin(frameCount));
    pop();
  }
}

function preload() {
  song = loadSound("../assets/HedwigsTheme.mp3");
  wand = loadImage("../assets/wand.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  mFFT = new p5.FFT();
  amplitude = new p5.Amplitude();
  angleMode(DEGREES);

  colorPicker = createColorPicker(color(12,0,179));
  colorPicker.position(0, 10);
  colorPicker.style('width', width + 'px');

  colorA = color(red(colorPicker.color()), random(230, 255), random(0, 255));
  colorB = color(random(230, 255), green(colorPicker.color()), random(230, 255));
  colorC = color(random(0, 255), random(230, 255), blue(colorPicker.color()));
}

function buildHexagon(x, y, a, color) {
  push();
  stroke(color);
  strokeWeight(2);
  translate(x, y);
  rotate(frameCount * a/50);
  beginShape();
  for (let angle = 0; angle < 360; angle += 60) {
    vertex(a * cos(angle), a * sin(angle));
  }
  endShape(CLOSE);
  pop()
}

function draw() {
  background(10, 35);

  mFFT.analyze();

  let energyT = mFFT.getEnergy("treble");
  diamT = map(energyT, 0, 255, 0, height / 3);

  let energyM = mFFT.getEnergy("mid");
  diamM = map(energyM, 0, 255, 0, height / 3);

  let energyB = mFFT.getEnergy("bass");
  diamB = map(energyB, 0, 255, 0, height / 3);

  buildHexagon(width / 2, height / 2, diamT, colorA);
  buildHexagon(width / 2, height / 2, diamM, colorB);
  buildHexagon(width / 2, height / 2, diamB, colorC);

  let volume = amplitude.getLevel();
  ballScale = map(volume, 0, 1, 10, 200);

  for (let move of moves) {
    move.updateAndDraw(moves);
  }

  image(wand, mouseX - 35, mouseY - 20, 125, 125);
}

function mouseClicked() {
  if (song.isPlaying()) {
    moves.push(new Movey(mouseX, mouseY));
  } else {
    song.play();
  }
}
