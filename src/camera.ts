import { PerspectiveCamera } from "three";
import { CHUNKSIZE, MAX_CHUNKS } from "./geometry";

export const FOV_NORMAL = 75;
export const FOV_SPRINT = 85;

export const camera = new PerspectiveCamera(FOV_NORMAL, window.innerWidth / window.innerHeight, 0.1, MAX_CHUNKS*CHUNKSIZE);
camera.rotation.order = "YXZ"; // pitch yaw roll