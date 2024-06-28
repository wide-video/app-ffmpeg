export function run(args, system) {
	return new Promise(resolve => {
		const wasmUrl = new URL("wasm/ffmpeg-gpl-simd.wasm", document.location).href;
		const ffmpegUrl = new URL("wasm/ffmpeg-gpl-simd-wv.js", document.location).href;
		const ffmpegWorkerUrl = new URL("wasm/ffmpeg-gpl-simd.worker.js", document.location).href;
		const workerBlob = new Blob([`${executor.toString()};executor();`], {type:"text/javascript"});
		const workerUrl = URL.createObjectURL(workerBlob);
		const worker = new Worker(workerUrl);
		const {fileSystem, terminal} = system;
		URL.revokeObjectURL(workerUrl);
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
						terminal.write(buffer.substring(0, index), kind, index === indexR)
						buffers[kind] = buffer.substring(index + 1);
					}
					break;
				}
				case "onExit":
					const files = data.files;
					fileSystem.add(files);
					files.forEach(file => terminal.writeBlob(file));
					worker.terminate();
					resolve();
					break;                    
			}
		}

		const files = fileSystem.list;
		worker.postMessage({args, wasmUrl, ffmpegUrl, ffmpegWorkerUrl, files});
	})
}

function executor() {
	const post = (message, options) => self.postMessage(message, options);
	
	self.onmessage = async (event) => {
		const {args, wasmUrl, ffmpegUrl, ffmpegWorkerUrl, files} = event.data;
		importScripts(ffmpegUrl);
		const module = await createFFmpeg({
			stderr:(buffer, offset, length) => {
				if(!length) return;
				const message = buffer.slice(offset, offset + length).buffer;
				post({kind:"stderr", message}, {transfer:[message]});
			},
			stdout:(buffer, offset, length) => {
				if(!length) return;
				const message = buffer.slice(offset, offset + length).buffer;
				post({kind:"stdout", message}, {transfer:[message]});
			},
			printErr:console.log,
			locateFile:url => {
				if(url.endsWith(".wasm")) return wasmUrl;
				if(url.endsWith(".worker.js")) return ffmpegWorkerUrl;
				return url;},
			mainScriptUrlOrBlob:ffmpegUrl});

		const FS = module.FS;
		FS.mkdir("workerfs");
		FS.mount(module.WORKERFS, {files}, "workerfs");

		const dirContent = FS.readdir("/");
		module.onExit = () => {
			const files = [];
			for(const filename of FS.readdir("/"))
				if(!dirContent.includes(filename)) {
					const content = FS.readFile(filename);
					let options = undefined;
					if(filename.endsWith(".mp4")) options = {type:"video/mp4"};
					files.push(new File([content.buffer], filename, options));
				}
			self.postMessage({kind:"onExit", files});
		}
		module.callMain(args);
	};
}