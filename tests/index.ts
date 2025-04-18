/*
import Module from './engine/testwasm'; // if using Vite + ESM

let wasm: any;

Module().then((mod) => {
  wasm = mod;

  const outLenPtr = wasm._malloc(4); // space for int
  const ptr = wasm._generatePoints(outLenPtr);
  const len = wasm.getValue(outLenPtr, 'i32');

  const f32Array = new Float32Array(
    wasm.HEAPF32.buffer,
    ptr,
    len
  );

  // Make a copy for safe transfer (or transfer the buffer if you know it's safe)
  const pointsCopy = new Float32Array(f32Array); 

	console.log(`points: ${pointsCopy}`);

  wasm._free(outLenPtr); // clean up
});
*/

const wrk = new Worker(new URL('./workertest.ts', import.meta.url), { type: 'module' });
wrk.onmessage = (ev: MessageEvent) => {
	console.log('worker ran 1000 times!');
}

let animCount = 0;
function anim() {
	++animCount;
	if (animCount % 100 === 0) {
		console.log(`[main] animated! animCount = ${animCount}`);
	}
	requestAnimationFrame(anim);
}

requestAnimationFrame(anim);