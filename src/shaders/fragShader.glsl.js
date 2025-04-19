export default `
precision mediump float;

// varying vec3 normalVec;
// uniform vec3 lightDir;

varying vec4 worldCoordinates;
varying vec3 vNormal;

const vec3 BASE_COLOR = vec3(0.7, 0.3, 0.4);
const vec3 GRID_COLOR = vec3(0.6);
const vec3 GRID_COLOR_LG = vec3(0.3);

const float AMB_LIGHT = 0.2;
const vec3 LIGHT_DIR = vec3(0., 1., 0.);

float modStrict(float x, float y) {
  return x - y * trunc(x / y);
}

vec4 getHeightmapLighting(float worldY) {
	// float val = 0.5+(sign(worldY)*(1.-exp(-(worldY*worldY/100.))))/4.;
	float val = 0.5 + (sign(worldY) * (max(0., log(abs(worldY))/40.)));
	return vec4(val, val, val, 1.0);
}

void main() {	
	// float brightness = max(dot(normalize(vNormal), normalize(LIGHT_DIR)), 0.0);
  // vec3 baseColor = vec3(0.2, 0.8, 0.4);
  // vec3 color = baseColor * brightness;
  // gl_FragColor = vec4(color, 1.0);

	// GRIDLINES
	// if world coordinates have integer x or y, set to grid color
	// else use base color
	if (abs(modStrict(worldCoordinates.x, 100.0)) <= 0.3 || abs(modStrict(worldCoordinates.y, 100.0)) <= 0.3) {
		gl_FragColor = vec4(GRID_COLOR_LG, 1.0);
	} else if (abs(modStrict(worldCoordinates.x, 10.0)) <= 0.3 || abs(modStrict(worldCoordinates.y, 10.0)) <= 0.3) {
		gl_FragColor = vec4(GRID_COLOR, 1.0);
	} else {
		// SCUFFED NORMAL-LESS LIGHTING
		vec4 lightingColor;
		vec3 dx = dFdx(worldCoordinates.xzy);
		vec3 dy = dFdy(worldCoordinates.xzy);
		vec3 normal = normalize(cross(dx, dy));

		float light = 0.5 + dot(normal, normalize(LIGHT_DIR))/2.;
		float colorR = max(AMB_LIGHT, BASE_COLOR.r * light);
		float colorG = max(AMB_LIGHT, BASE_COLOR.g * light);
		float colorB = max(AMB_LIGHT, BASE_COLOR.b * light);
		gl_FragColor = vec4(colorR, colorG, colorB, 1.0);
	}

	

	//gl_FragColor = vec4(0.0, 0.0, 0.5 + worldCoordinates.z/2., 1.0);

	// x>y: base color, else grid color
	// gl_FragColor = vec4((worldCoordinates.x > worldCoordinates.y)? BASE_COLOR : GRID_COLOR, 1.0);

	// float sunlightFactor = max(0., dot(vNormal.yxz, LIGHT_DIR));
	// float actualLightFactor = clamp(sunlightFactor + AMBIENT_LIGHT, 0.0, 1.0);
	// 
	// gl_FragColor = vec4(BASE_COLOR * actualLightFactor, 1.0);
	// gl_FragColor = vec4(0.5 + vNormal.x/2., 0.5 + vNormal.y/2., 0.5 + vNormal.z/2., 1.0);
}
`;