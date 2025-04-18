import { resolve } from 'path';
import Module from '../src/engine/testwasm'; // if using Vite + ESM

let wasm: any;

Module().then((mod) => {
  wasm = mod;

	let numChunks = 0;
	const maxChunks = 1000;
	const res = 201;
	const elementsPerChunk = res*res*3;
	const pointsArr = new Float32Array(elementsPerChunk*maxChunks);
	const chunkdata = [-100, 100, -100, 100, res];

	const outPtr = wasm._malloc(res*res);	
	for (let i = 0; i < maxChunks; i++) {
		wasm._eval_chunk(outPtr, ...chunkdata);

		// o(1) view (doesnt copy)
		const tempArrView = new Float32Array(wasm.HEAPF32.buffer, outPtr, res*res);
		pointsArr.set(tempArrView, numChunks*elementsPerChunk);
		++numChunks;
		chunkdata[0]++;
		chunkdata[1]++;
		chunkdata[2]++;
		chunkdata[3]++;
	}
});


/*
let c = 0;
while (1) {
	++c;
	if (c % 100000000 === 0) { 
		console.log(`[worker] c hit 100mil! resetting...`);
		c = 0;
	}
}
*/


/*
let ct = 0;
while (1) {
	const x = 0;
	const idx = 1000;
	const maxlen = 1000000;
	const arr = new Float32Array(maxlen);

	for (let i = 0; i < maxlen; i++) {
		arr[i] = x + Math.sin(i)*i*2/1000;
	}

	const ret = arr[idx];
	++ct;

	if (ct % 1000 === 0) {
		self.postMessage({});
	}
}
*/