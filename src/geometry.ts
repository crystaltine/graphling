import * as three from 'three';

export const CENTER_RESOLUTION = 25; // for now just have this scale down -1 per LOD ring until =3
export const CHUNKSIZE = 100;
export const MAX_CHUNKS = 200*200;

export namespace GeometryHandler {

	export const sharedPointsBuffer = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT*CENTER_RESOLUTION*CENTER_RESOLUTION*3*MAX_CHUNKS);
	const pointsBuffer = new Float32Array(sharedPointsBuffer);
	
	export const sharedFacesBuffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT*(CENTER_RESOLUTION-1)*(CENTER_RESOLUTION-1)*3*2*MAX_CHUNKS);
	const facesBuffer = new Uint32Array(sharedFacesBuffer);

	export const graphGeometry = new three.BufferGeometry();
	const positionAttr = new three.BufferAttribute(pointsBuffer, 3);
	const indexAttr = new three.BufferAttribute(facesBuffer, 1);
	graphGeometry.setAttribute('position', positionAttr);
	graphGeometry.setIndex(indexAttr);
	graphGeometry.setDrawRange(0, 0);

	let facesWorker: Worker;

	export function initFacesWorkerLoop() {
		facesWorker = new Worker(new URL('./facesWorker.ts', import.meta.url), { type: 'module' });
	
		// send it shared buffer
		facesWorker.postMessage({type: 'init', sharedBuf: GeometryHandler.sharedFacesBuffer});
	}

	function updateFaceIndices(resolution: number, idxOffset: number): void {
		facesWorker.postMessage({type: 'job', resolution, idxOffset});
	}

	let prevPointsArrCount = 0;
	export function updateWithNewChunk(newPointsArrCount: number, lastChunkResolution: number) {
		// console.log(`upd prev/new/lastres: ${prevPointsArrCount} ${newPointsArrCount} ${lastChunkResolution}`);
		// console.log('before')
		updateFaceIndices(lastChunkResolution, prevPointsArrCount/3);
		// console.log('after')
		prevPointsArrCount = newPointsArrCount;
		graphGeometry.setDrawRange(0, newPointsArrCount*2);

		// console.log(`b4 computing vertex norms`);
		// graphGeometry.computeVertexNormals();
		// console.log(`after`);
		indexAttr.needsUpdate = true;
		positionAttr.needsUpdate = true;
		// last 3 vtxs: ${positionAttr.array.slice(newPointsArrCount-9, newPointsArrCount)}`)
	}
}