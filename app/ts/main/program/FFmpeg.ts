import * as BlobUtil from "~util/BlobUtil";
import { FFMPEG } from "~/Const";
import { FFmpegWorkerIn } from "common/FFmpegWorkerIn";
import { FFmpegWorkerOut } from "common/FFmpegWorkerOut";
import * as Format from "~util/Format";
import * as ProgramUtil from "~util/ProgramUtil";
import { Program } from "~program/Program";
import { System } from "~type/System";
import * as UrlUtil from "~util/UrlUtil";

export class FFmpeg extends Program {
	constructor(system:System) {
		super("ffmpeg", system);
	}

	override run(args:ReadonlyArray<string>, signal:AbortSignal) {
		return new Promise<void>(async (resolve, reject) => {
			const {fileSystem, shell, terminal} = this.system;
			const ffmpeg:FFmpegWorkerIn["ffmpeg"] = {...FFMPEG.FILES};

			for(const [key, asset] of Object.entries(ffmpeg)) {
				let blob;
				try {
					blob = fileSystem.get(asset);
				} catch(error) {
					try {
						await ProgramUtil.fetch(UrlUtil.ffmpegUrl(<any>asset), shell, signal);
						blob = fileSystem.get(asset);
					} catch(error) {
						return reject(error);
					}
				}
				(<any>ffmpeg)[key] = BlobUtil.url(blob);
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
				if(signal.aborted)
					return;
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
								terminal.clearLine(`ffmpeg-${kind}`);
							terminal[kind](buffer.substring(0, index), `ffmpeg-${kind}`);
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

			const message:FFmpegWorkerIn = {args, files:fileSystem.list, ffmpeg};
			worker.postMessage(message);
		})
	}

	override help() {
		const name = this.name;
		return this.joinSections(this.manTemplate({
			description:["Universal media converter"],
			examples:[
				{description: "Print a list of basic options available in FFmpeg:",
				command: `${name} -h`},

				{description: "Extract the first 10 frames of a video:",
				command: `${name} -i input.mp4 -vframes 10 output%03d.jpg`},

				{description: "Generate a demo video using the smptehdbars and sine filters:",
				command: `${name} -filter_complex "smptehdbars;sine=beep_factor=2" -t 5 output.mp4`},

				{description: "Split the audio and video into separate files:",
				command: `${name} -i input.mp4 -map 0:v -c:v copy output-video.mp4 -map 0:a -c:a copy output-audio.mp4`},

				{description: "Trim 15 seconds from a video without re-encoding:",
				command: `${name} -ss 00:00:10.000 -t 00:00:15.000 -i input.mp4 -c copy output.mp4`},

				{description: "Concatenate multiple video files quickly without re-encoding using concat.txt:"
					+ `${Format.NLII}file 'input1.mp4'`
					+ `${Format.NLII}file 'input2.mp4'`,
				command: `${name} -f concat -i concat.txt -c copy output.mp4`},

				{description: "Flip a video horizontally:",
				command: `${name} -i input.mp4 -vf hflip -c:a copy output.mp4`},
			
				{description: "Resize a video to a width of 1280 pixels while maintain the aspect ratio:",
				command: `${name} -i input.mp4 -filter:v scale=1280:-2 -c:a copy output.mp4`},
				
				{description: "Re-encode a video using HEVC (H.265) video codec and AC3 audio codec:",
				command: `${name} -i input.mp4 -c:v libx265 -vtag hvc1 -c:a ac3 output.mp4`},

				{description: "Add a watermark to a video:",
				command: `${name} -i input.mp4 -i logo.png -filter_complex overlay=x=50:y=50 output.mp4`},

				{description: "Bypass WASM memory limitations to generate output of several GBs in size:",
				command: `${name} -i input.mp4 -movflags empty_moov huge/output.mp4 -y`}
			]}));
	}
}

// fixes chrome crashes when many blobs are returned
function terminate(worker:Worker) {
	setTimeout(() => {
		try {
			worker.terminate();
		} catch(error) {}}, 500);
}