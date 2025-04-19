export default `
precision mediump float;

varying vec4 worldCoordinates;
varying vec3 vNormal;

void main() {
  vNormal = normal.xzy;
  vec4 pos = vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * pos;
  worldCoordinates = worldPosition.xzyw;

  gl_Position = projectionMatrix * modelViewMatrix * pos;
}
`;