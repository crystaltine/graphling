import { GeometryHandler } from "./geometry";

export class LODCoordinateGenerator {
	centerResolution: number;
	chunksize: number;

	currCX: number = 0;
	currCY: number = 0;
	currRing: number = 0;
	stitchingOffsets: number[] = [0];

	constructor(centerResolution: number, chunksize: number) {
		this.centerResolution = centerResolution;
		this.chunksize = chunksize;
	}

	getNext(): number[] {
		const xCoord = (this.currCX - 0.5)*this.chunksize + Math.sign(this.currCX) * this.stitchingOffsets[Math.abs(this.currCX)];
		const yCoord = (this.currCY - 0.5)*this.chunksize + Math.sign(this.currCY) * this.stitchingOffsets[Math.abs(this.currCY)];
		const ret = [xCoord, xCoord+this.chunksize, yCoord, yCoord+this.chunksize, this.centerResolution-this.currRing];

		/* 
		Ring movement format (topright is +x,+y)
		[v] [<] [<] [<] [^]
		[v] [v] [<] [^] [^]
		[v] [v] [^] [^] [^]
		[v] [>] [>] [^] [^]
		[>] [>] [>] [>] [^]
		*/

		if (this.currCX === this.currRing) {
			// on right edge of chunk ring
			if (this.currCX === this.currCY) {
				// also on the last chunk in the ring (topright corner)
				const prevOffset = this.stitchingOffsets[this.stitchingOffsets.length-1];
				this.stitchingOffsets.push(prevOffset + this.chunksize/(this.centerResolution-2-this.currRing));
				++this.currRing;
			}
			++this.currCY;
		} else if (this.currCX !== -this.currRing && this.currCY === this.currRing) {
			// top of ring (excluding TL corner)
			--this.currCX;
		} else if (this.currCX === -this.currRing && this.currCY !== -this.currRing) {
			// left of ring (excluding BL corner)
			--this.currCY;
		} else {
			++this.currCX;
		}
	
		return ret;
	}
}

export function initCalculatorLoop() {
	const wrk = new Worker(new URL('./calcWorker.ts', import.meta.url), { type: 'module' });

	// send it shared buffer
	wrk.postMessage(GeometryHandler.sharedPointsBuffer);

	wrk.addEventListener('message', (ev: MessageEvent) => {
		// should be an update for geometry handler
		const {newPointsArrCount, lastChunkResolution} = ev.data;
		// console.log(`got new data! ${newPointsArrCount} / ${lastChunkResolution}`)
		GeometryHandler.updateWithNewChunk(newPointsArrCount, lastChunkResolution);
	});
}