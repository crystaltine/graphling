import * as three from 'three';
import { camera } from './camera';

export const bgScene = new three.Scene();
const geometry = new three.PlaneGeometry(2, 2);

export const bgUniforms = {
	scrnHeight: { value: window.innerHeight },
	cameraPitch: { value: camera.rotation.x },
	cameraYFov: { value: Math.PI * camera.fov / 180 },
};
const material = new three.ShaderMaterial({
  uniforms: bgUniforms,
  vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float scrnHeight;
		uniform float cameraPitch;
		uniform float cameraYFov;

		const vec4 skyColor = vec4(0.38, 0.62, 1.0, 1.0);
		const vec4 groundColor = vec4(0.3, 0.3, 0.3, 1.0);
		const vec4 horizonColor = vec4(0.9, 0.95, 1.0, 1.0);

    void main() {

      float tanHalfFOV = tan(cameraYFov/2.);
			float horizon = scrnHeight/2. * (1. - tan(cameraPitch)/tanHalfFOV);
			
      if (gl_FragCoord.y > horizon) {
        gl_FragColor = mix(horizonColor, skyColor, clamp((gl_FragCoord.y - horizon)/100., 0., 1.));
      } else {
        gl_FragColor = mix(horizonColor, groundColor, clamp((horizon - gl_FragCoord.y)/100.+0.8, 0.0, 1.0));
      }
    }
  `,
  depthTest: false,
  depthWrite: false
});

const quad = new three.Mesh(geometry, material);
quad.frustumCulled = false;
bgScene.add(quad);
