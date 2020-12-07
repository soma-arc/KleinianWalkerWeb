import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class pointsGenerator extends PApplet {

ArrayList<PVector> points = new ArrayList<PVector>();
PImage img;
PVector translation;
PVector mousePressStart;
public void setup() {
  
  points.add(new PVector(0, 0));
  img = loadImage("img.png");
  translation = new PVector(0.0f, 0.0f);
}

public void draw() {
  background(255);
  image(img, translation.x, translation.y);
  fill(255, 0, 0);
  translate(width / 2, height / 2);
  line(-width/2, 0, width/2, 0);
  line(0, -height/2, 0, height/2);
  beginShape(TRIANGLE_FAN);
  for (PVector p : points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

public void mousePressed() {
  if(mouseButton == LEFT){
    points.add(new PVector(mouseX - width/2, 
      mouseY - height/2));
  } else if (mouseButton == RIGHT){
    mousePressStart = new PVector(mouseX, mouseY).sub(translation);
  }
}

public void mouseDragged(){
  if(mouseButton == RIGHT){
    translation = new PVector(mouseX, mouseY).sub(mousePressStart);
  }
}

public void keyPressed() {
  if (key == ' ') {
    PVector p = points.get(0);
    points.add(p);
  } else if(key == 'd'){
    points.remove(points.size()-1);
  }else if (key == 's') {
    float scale = 0.1f;
    println("writing points...");
    PrintWriter output = createWriter("points.csv");
    int i = 0;
    for(PVector p : points){
      output.print(p.x * scale +","+ p.y * scale);
      if(i != points.size() - 1){
        output.println();
      }
      i++;
    }
    output.flush();
    output.close();
    println("Done");
  }
}
  public void settings() {  size(640, 640); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "pointsGenerator" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
