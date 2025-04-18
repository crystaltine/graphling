export default `
precision mediump float;
varying vec3 vNormal;

void main() {
  vNormal = normalize((normal.xzy));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
`;