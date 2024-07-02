import * as Const from "common/Const";
import { FFmpegWorkerOut } from "common/FFmpegWorkerOut";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class FFmpeg extends Program {
	constructor(system:System) {
		super("ffmpeg", system);
	}

	override run(args:ReadonlyArray<string>, signal:AbortSignal) {
		return new Promise<void>(async (resolve, reject) => {
			const {fileSystem, shell, terminal} = this.system;
			const dependencies = [Const.FFMPEG_JS_FILENAME, Const.FFMPEG_WORKER_FILENAME, Const.FFMPEG_WASM_FILENAME];
			for(const dependency of dependencies)
				try {
					fileSystem.get(dependency);
				} catch(error) {
					try {
						await shell.subprocess(`fetch ${new URL(`ffmpeg-${Const.FFMPEG_VERSION}/${dependency}`, location.href).href}`, signal);
					} catch(error) {
						return reject(error);
					}
				}

			const worker = new Worker("./FFmpegWorker.js", {type:"module"});
			signal.addEventListener("abort", () => {
				worker.terminate();
				reject(signal.reason);
			})
			const decoder = new TextDecoder("utf8");
			const buffers = {stderr:"", stdout:""};
			worker.onerror = event => {
				worker.terminate();
				reject(`Unexpected error: ${event.message}`);
			}
			worker.onmessage = event => {
				const data = event.data as FFmpegWorkerOut;
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
					case "onExit": {
						const files = data.files;
						worker.terminate();
						fileSystem.add(files);
						shell.subprocess(`embed ${files.map(file => file.name).join(" ")}`, signal);
						resolve();
						break;
					}
				}
			}

			const files = fileSystem.list;
			worker.postMessage({args, files});
		})
	}
}