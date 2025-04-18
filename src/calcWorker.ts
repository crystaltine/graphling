// worker script

import { LODCoordinateGenerator } from "./calculator";
import { CENTER_RESOLUTION, CHUNKSIZE, MAX_CHUNKS } from './geometry';
import createEvalModule from './engine/evaluate';

let sharedArr: Float32Array | null = null;
let wasm: any | null = null;
let mainCalled = false; 

// wouldnt be surprised if this entire file isnt threadsafe
self.addEventListener('message', (ev: MessageEvent) => {
	const sharedBuf = ev.data;
	sharedArr = new Float32Array(sharedBuf);
	main();
});
createEvalModule().then(mod => { 
	wasm = mod;
	main();
});

function main() {
	if (sharedArr === null || wasm === null) return;
	if (mainCalled) return;
	mainCalled = true;

	const coordGen = new LODCoordinateGenerator(
		CENTER_RESOLUTION, CHUNKSIZE
	);

	let chunkCount = 0; // num generated chunks
	let sharedArrCount = 0; // num filled eles in the shared arr

	// malloc enough space for the largest, then just keep using this lmfao
	const outPtr = wasm._malloc(CENTER_RESOLUTION*CENTER_RESOLUTION);

	while (chunkCount < MAX_CHUNKS) {
		const chunkSpecifications = coordGen.getNext();	
		wasm._eval_chunk(outPtr, ...chunkSpecifications);

		// edit shared buffer (chunkSpecs[4] is resolution)
		const numPointsCalced = chunkSpecifications[4]*chunkSpecifications[4]*3;

		// slow af copy. TODO - figure out letting c++ use the sharedArray directly (zero copies would go crazy) 
		const tempArrView = new Float32Array(wasm.HEAPF32.buffer, outPtr, numPointsCalced); // o(1)
		sharedArr.set(tempArrView, sharedArrCount); // copy happens here

		++chunkCount;
		sharedArrCount += numPointsCalced;

		// tell geometer to update
		self.postMessage({ newPointsArrCount: sharedArrCount, lastChunkResolution: chunkSpecifications[4] });
	}
	wasm._free(outPtr);
}

