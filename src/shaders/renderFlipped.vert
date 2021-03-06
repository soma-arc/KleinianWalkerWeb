#version 300 es
precision mediump float;

uniform mat4 u_mvpMatrix;
in vec3 vPosition;
in vec3 color;
out vec4 vColor;

void main() {
  vColor = vec4(color, 1);
  vec3 p = vec3(vPosition.x, vPosition.y, vPosition.z * -1.0);
  gl_Position = u_mvpMatrix * vec4(p, 1.0);
  gl_PointSize = 1.;
}
