import * as three from 'three';

export const CENTER_RESOLUTION = 201; // for now just have this scale down -1 per LOD ring until =3
export const CHUNKSIZE = 100;
export const MAX_CHUNKS = 5*5;

export namespace GeometryHandler {

	let facesBufferOffset = 0; // also stores len
	export const sharedPointsBuffer = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT*CENTER_RESOLUTION*CENTER_RESOLUTION*3*MAX_CHUNKS);
	const pointsBuffer = new Float32Array(sharedPointsBuffer);
	const facesBuffer = new Uint32Array((CENTER_RESOLUTION-1)*(CENTER_RESOLUTION-1)*3*2*MAX_CHUNKS);

	export const graphGeometry = new three.BufferGeometry();
	const positionAttr = new three.BufferAttribute(pointsBuffer, 3);
	const indexAttr = new three.BufferAttribute(facesBuffer, 1);
	graphGeometry.setAttribute('position', positionAttr);
	graphGeometry.setIndex(indexAttr);
	graphGeometry.setDrawRange(0, 0);

	let prevPointsArrCount = 0;
	export function updateWithNewChunk(newPointsArrCount: number, lastChunkResolution: number) {
		// console.log(`upd prev/new/lastres: ${prevPointsArrCount} ${newPointsArrCount} ${lastChunkResolution}`);
		_updateFaceIndices(lastChunkResolution, prevPointsArrCount/3);
		prevPointsArrCount = newPointsArrCount;
		graphGeometry.setDrawRange(0, newPointsArrCount*2);
		graphGeometry.computeVertexNormals();

		indexAttr.needsUpdate = true;
		positionAttr.needsUpdate = true;
		// last 3 vtxs: ${positionAttr.array.slice(newPointsArrCount-9, newPointsArrCount)}`)
	}

	function _updateFaceIndices(resolution: number, idxOffset: number): void {
		let ct = 0;
		for (let r = -1; ++r < resolution-1;) {
			for (let c = -1; ++c < resolution-1;) {
				const idx = r*resolution+c;
				facesBuffer.set([idx+idxOffset, idx+resolution+idxOffset, idx+1+idxOffset], ct*3+facesBufferOffset);
				++ct;	
			}
		}
		for (let r = 0; ++r < resolution;) {
			for (let c = 0; ++c < resolution;) {
				const idx = r*resolution+c;
				facesBuffer.set([idx+idxOffset, idx-resolution+idxOffset, idx-1+idxOffset], ct*3+facesBufferOffset);
				++ct;	
			}
		}

		// console.log(`updFaces: first->last tri ${facesBuffer.slice(facesBufferOffset, facesBufferOffset+3)} -> ${facesBuffer.slice(facesBufferOffset+(resolution-1)*(resolution-1)*2*3-3, facesBufferOffset+(resolution-1)*(resolution-1)*2*3)}`);

		facesBufferOffset += (resolution-1)*(resolution-1)*2*3;
	}
}