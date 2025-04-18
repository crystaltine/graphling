import { PerspectiveCamera } from "three";

export const FOV_NORMAL = 75;
export const FOV_SPRINT = 85;

export const camera = new PerspectiveCamera(FOV_NORMAL, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.rotation.order = "YXZ"; // pitch yaw roll