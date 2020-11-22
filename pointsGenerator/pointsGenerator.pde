ArrayList<PVector> points = new ArrayList<PVector>();

void setup() {
  size(640, 640);
}

void draw() {
  background(255);
  fill(255, 0, 0);
  translate(width / 2, height / 2);
  beginShape(TRIANGLE_FAN);
  vertex(0, 0);
  for (PVector p : points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

void mousePressed() {
  points.add(new PVector(mouseX - width/2, 
    mouseY - height/2));
}

void keyPressed() {
  if (key == 'a') {
    PVector p = points.get(0);
    points.add(p);
  } else if (key == 's') {
    PrintWriter output = createWriter("points.csv");
    for(PVector p : points){
      output.println(p.x +","+p.y);
    }
    output.flush();
    output.close();
  }
}
