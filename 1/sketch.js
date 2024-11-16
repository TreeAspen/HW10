let song;
let peaks;
let peakIndex = 0;

function preload() {
  song = loadSound('../assets/FloruitShow.mp3');
  angleMode(DEGREES)
}

function flower(x,y,peakValue){
  push();
  noFill()
  stroke(random(255),random(255),random(255));
  translate(x,y)

  for(let i=0;i < 7;i++){
    beginShape()
    vertex(0,0);
    vertex(peakValue/2,peakValue*1.5);
    vertex(0,peakValue*2);
    vertex(-peakValue/2,peakValue*1.5);
    vertex(0,0);
    endShape()
    rotate(360/7)
  }
  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  peaks = song.getPeaks();
  print(peaks);
  background(0);
  translate(width / 2, height / 2);
  stroke(255);
  noFill();

  let step = 10;
  let size = 20; 
  let x = 0;
  let y = 0;
  let dir = 0;

  beginShape();
  for (let i = 0; i < peaks.length; i++) {
    let peakValue = map(peaks[i] * 100,0,50,0,25);

    if (dir === 0) {
      x += step;
      vertex(x, y - peakValue);
      vertex(x, y + peakValue);
    } else if (dir === 1) {
      y += step;
      vertex(x - peakValue, y);
      vertex(x + peakValue, y);

    } else if (dir === 2) {
      x -= step;
      vertex(x, y - peakValue);
      vertex(x, y + peakValue);
    } else if (dir === 3) {
      y -= step;
      vertex(x - peakValue, y);
      vertex(x + peakValue, y);
    }

    if (x >= size / 2 && dir === 0) {
      dir = 1;
    } else if (y >= size / 2 && dir === 1) {
      dir = 2;
    } else if (x <= -size / 2 && dir === 2) {
      dir = 3;
    } else if (y <= -size / 2 && dir === 3) {
      dir = 0;
      size += step * 2;
    }
  }
  endShape();
  step = 10;

  for (let i = 0; i < 100; i++) {
    peakValue = map(peaks[i] * 100,0,50,0,500);
    rotate(i*step)
    flower(0,0,peakValue);
  }   
}
