import * as three from 'three';
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { camera, FOV_NORMAL, FOV_SPRINT } from "./camera";
import { bgUniforms } from './background';

export namespace Controls {
	
	export const documentKeys = {};
	document.addEventListener('mousemove', (ev: MouseEvent) => {
		if (Math.abs(ev.movementX - lastMouseMove.x) > 200 || Math.abs(ev.movementY - lastMouseMove.y) > 200) {
			console.log(`PREVENTED TOMFOOLERY: xymove = ${ev.movementX} / ${ev.movementY}`)
			ev.stopImmediatePropagation();
			return;
		}
		lastMouseMove.x = ev.movementX;
		lastMouseMove.y = ev.movementY;
	});
	const controls = new PointerLockControls(camera, document.body);

	let lastMouseMove = { x: 0, y: 0 };

	let movementInfo = {
		currVelForward: 0.0,
		currVelRight: 0.0,
		maxVel: 3,	
		sprinting: false,
	}

	export function init(scene: three.Scene) {
		scene.add(controls.object);

		document.addEventListener('click', () => controls.lock(), false);

		window.addEventListener('keydown', (ev: KeyboardEvent) => {
			documentKeys[ev.key.toLowerCase()] = true;
		});
		window.addEventListener('keyup', (ev: KeyboardEvent) => {
			delete documentKeys[ev.key.toLowerCase()];
		});
	}

	export function isKeyDown(key: string): boolean {
		return documentKeys[key] || false;
	}

	export function handleMovement() {
		// runs every frame btw so keep changes small

		// default de-accel
		movementInfo.currVelForward /= 1.05;
		movementInfo.currVelRight /= 1.05;

		// keyboard movement control

		// sprinting lol
		if (isKeyDown("r") && !movementInfo.sprinting) {
			movementInfo.maxVel *= 2;
			movementInfo.sprinting = true;
		} else if (!isKeyDown("r") && movementInfo.sprinting) {
			movementInfo.maxVel /= 2;
			movementInfo.sprinting = false;
		}

		handleSmoothFOVTransition();

		if (isKeyDown("w")) movementInfo.currVelForward = Math.min(movementInfo.maxVel, movementInfo.currVelForward + movementInfo.maxVel/60.0);
		if (isKeyDown("s")) movementInfo.currVelForward = Math.max(-movementInfo.maxVel, movementInfo.currVelForward - movementInfo.maxVel/60.0);
		if (isKeyDown("a")) movementInfo.currVelRight = Math.max(-movementInfo.maxVel, movementInfo.currVelRight - movementInfo.maxVel/60.0);
		if (isKeyDown("d")) movementInfo.currVelRight = Math.min(movementInfo.maxVel, movementInfo.currVelRight + movementInfo.maxVel/60.0);

		controls.moveForward(movementInfo.currVelForward);
		controls.moveRight(movementInfo.currVelRight);

		// vertical movement normal
		if (isKeyDown("shift")) camera.position.add(new three.Vector3(0, -1, 0));
		if (isKeyDown(" ")) camera.position.add(new three.Vector3(0, 1, 0));
	}

	function handleSmoothFOVTransition() {
		if (movementInfo.sprinting && camera.fov < FOV_SPRINT) {
			camera.fov += (FOV_SPRINT - camera.fov)/15;
			bgUniforms.cameraYFov.value = Math.PI * camera.fov / 180;
			camera.updateProjectionMatrix();
		} else if (!movementInfo.sprinting && camera.fov > FOV_NORMAL) {
			camera.fov -= (camera.fov - FOV_NORMAL)/15;
			bgUniforms.cameraYFov.value = Math.PI * camera.fov / 180;
			camera.updateProjectionMatrix();
		}
	}
}