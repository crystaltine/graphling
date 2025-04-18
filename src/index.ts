import * as three from 'three';

import { updateCameraPosInfo } from './debug';
import { bgScene } from './background';
import { camera } from './camera';
import { bgUniforms } from './background';
import { Controls } from './controls';
import { GeometryHandler } from './geometry';
import { initCalculatorLoop } from './calculator';

const scene = new three.Scene();
Controls.init(scene);

const renderer = new three.WebGLRenderer();
renderer.domElement.classList.add("THREEJS-MAIN");
renderer.autoClear = false;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

// stuf
const LIGHT_DIR = new three.Vector3(0, 1.0, 0);
// const uniforms = {
//   lightDir: {value: LIGHT_DIR},
//   width: {value: window.innerWidth},
//   height: {value: window.innerHeight},
//   _time: {value: 0.0}, // set later in anim loop
// };

/*
for (let i = 0; i < 50; ++i) {
  const size = Math.random() + 0.3;

  const xpos = Math.random() * 20 - 10;
  const ypos = Math.random() * 20 - 10;
  const zpos = Math.random() * 20 - 10;

  const geometry = new three.IcosahedronGeometry(size, 0);
  const material = new three.ShaderMaterial({
    uniforms,
    fragmentShader: fragShader,
    vertexShader: vertShader,
    wireframe: true
  });
  const cube = new three.Mesh(geometry, material);
  cube.position.set(xpos, ypos, zpos)
  scene.add(cube);
}
const geometry = new three.IcosahedronGeometry(3, 0);
const material = new three.ShaderMaterial({
  uniforms,
  fragmentShader: fragShader,
  vertexShader: vertShader,
});
const icos = new three.Mesh(geometry, material);
scene.add(icos);
*/

// basic lighting
const mainLight = new three.DirectionalLight(0xffffff, 3); // new three.HemisphereLight(0xffffff, 0x000000, 1.0);
mainLight.position.set(0, 100, 0);
const ambLight = new three.AmbientLight(0xffffff, 0.1);
scene.add(mainLight, ambLight);

// graphing

/*
const graphMaterial = new three.ShaderMaterial({
  fragmentShader: graphFragShader,
  vertexShader: graphVertShader,
  side: three.DoubleSide,
})
*/
const graphMaterial = new three.MeshLambertMaterial({ color: 0xc0cfd9, side: three.DoubleSide });
graphMaterial.flatShading = true;

const graphMesh = new three.Mesh(GeometryHandler.graphGeometry, graphMaterial);
scene.add(graphMesh);
graphMesh.frustumCulled = false;

// axes
const AXES_PTS = [
  [new three.Vector3(0, 0, 0), new three.Vector3(100, 0, 0)],
  [new three.Vector3(0, 0, 0), new three.Vector3(0, 100, 0)],
  [new three.Vector3(0, 0, 0), new three.Vector3(0, 0, 100)],
  [new three.Vector3(0, 0, 0), new three.Vector3(-100, 0, 0)],
  [new three.Vector3(0, 0, 0), new three.Vector3(0, -100, 0)],
  [new three.Vector3(0, 0, 0), new three.Vector3(0, 0, -100)]
];
const AXES_COLORS = [0xff0000, 0x00ff00, 0x0000ff, 0xcf40b4, 0x40c89f, 0x8090c9];
for (let i = 0; i < AXES_PTS.length; ++i) {
  const axesLineMaterial = new three.LineBasicMaterial({color: AXES_COLORS[i]});
  const axisGeo = new three.BufferGeometry().setFromPoints(AXES_PTS[i]);
  scene.add(new three.Line(axisGeo, axesLineMaterial));
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

camera.position.set(0, 50, 0);
camera.lookAt(new three.Vector3(0,0,0));

function animate() {
  bgUniforms.cameraPitch.value = camera.rotation.x;
  Controls.handleMovement();
  updateCameraPosInfo(camera);
  renderer.render(bgScene, camera);
  renderer.render(scene, camera);
}

initCalculatorLoop();
renderer.setAnimationLoop(animate);