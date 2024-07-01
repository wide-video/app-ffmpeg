import * as Const from "./Const.js";

export class FFmpeg {
	constructor(system) {
		this.system = system;
	}

	run(args) {
		return new Promise(async resolve => {
			const {fileSystem, terminal} = this.system;
			const dependencies = [Const.FFMPEG_JS_FILENAME, Const.FFMPEG_WORKER_FILENAME, Const.FFMPEG_WASM_FILENAME];
			for(const dependency of dependencies)
				try {
					fileSystem.get(dependency);
				} catch(error) {
					await terminal.execute(`fetch ${new URL(`wasm/${dependency}`, document.location).href}`);
				}

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
			worker.postMessage({args, files});
		})
	}
}