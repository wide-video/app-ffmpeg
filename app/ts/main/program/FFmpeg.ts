import { FFMPEG_WASM } from "common/Const";
import { FFmpegWorkerOut } from "common/FFmpegWorkerOut";
import * as ProgramUtil from "~util/ProgramUtil";
import { Program } from "~program/Program";
import { System } from "~type/System";``

export class FFmpeg extends Program {
	constructor(system:System) {
		super("ffmpeg", system);
	}

	override run(args:ReadonlyArray<string>, signal:AbortSignal) {
		return new Promise<void>(async (resolve, reject) => {
			const {fileSystem, shell, terminal} = this.system;
			const dependencies = [FFMPEG_WASM.MAIN_FILENAME, FFMPEG_WASM.WORKER_FILENAME, FFMPEG_WASM.WASM_FILENAME];
			for(const dependency of dependencies)
				try {
					fileSystem.get(dependency);
				} catch(error) {
					try {
						await ProgramUtil.fetch(new URL(`${FFMPEG_WASM.PATH}/${dependency}`, location.href).href, shell, signal);
					} catch(error) {
						return reject(error);
					}
				}

			const worker = new Worker("./FFmpegWorker.js", {type:"module"});
			signal.addEventListener("abort", () => {
				terminate(worker);
				reject(signal.reason);
			})
			const decoder = new TextDecoder("utf8");
			const buffers = {stderr:"", stdout:""};
			worker.onerror = event => {
				terminate(worker);
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
					case "error": {
						terminate(worker);
						reject(`Process finished with exit code ${data.code}`);
						break;
					}
					case "success": {
						const files = data.files;
						terminate(worker);
						fileSystem.add(files);
						if(files.length) {
							const max = 4;
							if(files.length > max)
								terminal.stdout(`Embedding ${Math.min(max, files.length)} of ${files.length} outputs:`);
							ProgramUtil.embed(files.slice(0, max).map(file => file.name), shell, signal);
						}
						resolve();
						break;
					}
				}
			}

			const files = fileSystem.list;
			worker.postMessage({args, files});
		})
	}

	override man() {
		const name = this.name;
		return this.joinSections(this.manTemplate({
			description:["Universal media converter"],
			examples:[{description:"xxx", command:`${name} -v`}]}));
	}
}

// fixes chrome crashes when many blobs are returned
function terminate(worker:Worker) {
	setTimeout(() => {
		try {
			worker.terminate();
		} catch(error) {}}, 500);
}