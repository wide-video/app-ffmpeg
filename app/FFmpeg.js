export class FFmpeg {
	constructor(system) {
		this.system = system;
	}

	run(args) {
		return new Promise(resolve => {
			const {fileSystem, terminal} = this.system;
			const wasmUrl = new URL("wasm/ffmpeg-gpl-simd.wasm", document.location).href;
			const ffmpegUrl = new URL("wasm/ffmpeg-gpl-simd-wv.js", document.location).href;
			const ffmpegWorkerUrl = new URL("wasm/ffmpeg-gpl-simd.worker.js", document.location).href;
			const worker = new Worker("./FFmpegWorker.js", {type:"module"});
			const decoder = new TextDecoder("utf8");
			const buffers = {stderr:"", stdout:""};
			worker.onmessage = event => {
				const data = event.data;
				const kind = data.kind;
				switch(kind) {
					case "stderr":
					case "stdout": {
						buffers[kind] += decoder.decode(data.message);
						while(true) {
							const buffer = buffers[kind];
							const indexN = buffer.indexOf("\n");
							const indexR = buffer.indexOf("\r");
							if(indexN === -1 && indexR === -1)
								break;

							const index = (indexN === -1 || ((indexR !== -1 && indexR < indexN))) ? indexR : indexN;
							if(index === indexR)
								terminal.clearLine();
							terminal[kind](buffer.substring(0, index));
							buffers[kind] = buffer.substring(index + 1);
						}
						break;
					}
					case "onExit":
						const files = data.files;
						worker.terminate();
						fileSystem.add(files);
						terminal.execute(`embed ${files.map(file => file.name).join(" ")}`);
						resolve();
						break;                    
				}
			}

			const files = fileSystem.list;
			worker.postMessage({args, wasmUrl, ffmpegUrl, ffmpegWorkerUrl, files});
		})
	}
}