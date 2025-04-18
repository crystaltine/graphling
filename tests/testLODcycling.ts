let cx = 0;
let cy = 0;

let currRing = 0;

const centerResolution = 6;
const chunksize = 100;
let stitchingOffsets = [0];

const arrsize = 7;
let arr = new Array(arrsize*arrsize);

let ct = 0;
function inc() {
	console.log(`${ct}: curr x/y/ring: ${cx} ${cy} ${currRing}`);
	const offset = [
		(cx - 0.5)*chunksize + Math.sign(cx) * stitchingOffsets[Math.abs(cx)],
		(cy - 0.5)*chunksize + Math.sign(cy) * stitchingOffsets[Math.abs(cy)]
	];
	console.log(`	\x1b[34moffsets: ${offset}\x1b[0m`)

	if (cx === currRing) {
		// on right edge of chunk ring
		if (cx === cy) {
			// also on the last chunk in the ring (topright corner)
			const prevOffset = stitchingOffsets[stitchingOffsets.length - 1];
			stitchingOffsets.push(prevOffset + chunksize/(centerResolution-2 - currRing));
			++currRing;
		}
		++cy;
	} else if (cx !== -currRing && cy === currRing) {
		// top of ring (excluding TL corner)
		--cx;
	} else if (cx === -currRing && cy !== -currRing) {
		// left of ring (excluding BL corner)
		--cy;
	} else {
		++cx;
	}
	ct++;
}

while (ct < arrsize*arrsize) {
	let i = cx + Math.floor(arrsize/2);
	let j = arrsize - (cy + Math.floor(arrsize/2)) - 1;
	arr[j*arrsize+i] = ct.toString().padStart(2, ' ');
	inc();
}

for (let r = 0; r < arrsize; ++r) {
	console.log(arr.slice(r*arrsize, r*arrsize+arrsize).join(" "));
}