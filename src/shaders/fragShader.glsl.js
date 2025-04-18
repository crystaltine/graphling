export default `
precision mediump float;

// varying vec3 normalVec;
// uniform vec3 lightDir;

varying vec3 vNormal;

const vec3 LIGHT_DIR = vec3(0., 1., 0.);
const float AMBIENT_LIGHT = 0.2;
const vec3 BASE_COLOR = vec3(0.7, 0.4, 0.8);

void main() {	
	float sunlightFactor = max(0., dot(vNormal.yxz, LIGHT_DIR));
	float actualLightFactor = clamp(sunlightFactor + AMBIENT_LIGHT, 0.0, 1.0);
	
	gl_FragColor = vec4(BASE_COLOR * actualLightFactor, 1.0);
	// gl_FragColor = vec4(0.5 + vNormal.x/2., 0.5 + vNormal.y/2., 0.5 + vNormal.z/2., 1.0);
}
`;