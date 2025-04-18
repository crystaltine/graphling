import { Camera, Vector3 } from "three";

const cameraPosLine = document.getElementById("camera-pos")!;
const cameraRotLine = document.getElementById("camera-rot")!;

export function updateCameraPosInfo(camera: Camera): void {
	cameraPosLine.innerText = `xyz: ${camera.position.x.toFixed(2)} / ${camera.position.y.toFixed(2)} / ${camera.position.z.toFixed(2)}`;
	cameraRotLine.innerText = `y/p: ${camera.rotation.y.toFixed(2)} / ${camera.rotation.x.toFixed(2)}`;
}