// worker script

let sharedArr: Uint32Array | null = null;

self.addEventListener('message', (ev: MessageEvent) => {
	if (ev.data.type === 'init') {
		const sharedBuf = ev.data.sharedBuf;
		sharedArr = new Uint32Array(sharedBuf);
	} else {
		const {resolution, idxOffset} = ev.data;
		main(resolution, idxOffset);
	}
});

let facesBufferOffset = 0;
function main(resolution: number, idxOffset: number): void {
	if (sharedArr === null) return;

	let ct = 0;
	for (let r = -1; ++r < resolution-1;) {
		for (let c = -1; ++c < resolution-1;) {
			const idx = r*resolution+c;
			sharedArr.set([idx+idxOffset, idx+resolution+idxOffset, idx+1+idxOffset], ct*3+facesBufferOffset);
			++ct;	
		}
	}
	for (let r = 0; ++r < resolution;) {
		for (let c = 0; ++c < resolution;) {
			const idx = r*resolution+c;
			sharedArr.set([idx+idxOffset, idx-resolution+idxOffset, idx-1+idxOffset], ct*3+facesBufferOffset);
			++ct;	
		}
	}

	facesBufferOffset += (resolution-1)*(resolution-1)*2*3;
}

