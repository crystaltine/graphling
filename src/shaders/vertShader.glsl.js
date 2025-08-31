export default function getVertShader() {return`
precision mediump float;

varying vec4 worldCoordinates;
varying vec3 vNormal;

float func(float x, float y) {
  return x + y;
}

void main() {
  vNormal = normal.xzy;
  vec4 pos = vec4(position, 1.0);
  vec4 worldPosition = modelMatrix * pos;
  worldCoordinates = worldPosition.xzyw;

  pos.y = func(worldPosition.x, worldPosition.z);

  gl_Position = projectionMatrix * modelViewMatrix * pos;
}
`;
}