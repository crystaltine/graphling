import { Camera, Vector3 } from "three";

const containerEle = document.getElementById("debug-text")!;
const cameraPosLine = document.getElementById("camera-pos")!;
const cameraRotLine = document.getElementById("camera-rot")!;

export function updateCameraPosInfo(camera: Camera): void {
	cameraPosLine.innerText = `xyz: ${camera.position.x.toFixed(2)} / ${camera.position.y.toFixed(2)} / ${camera.position.z.toFixed(2)}`;
	cameraRotLine.innerText = `y/p: ${camera.rotation.y.toFixed(2)} / ${camera.rotation.x.toFixed(2)}`;
}

export function setDebugVisible(visible: boolean): void {
	if (visible) {
		containerEle.style.display = "block";
	} else {
		containerEle.style.display = "none";
	}
}