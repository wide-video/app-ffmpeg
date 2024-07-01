import * as Const from "common/Const";
import * as ContentType from "common/ContentType"
import { FFmpegWorkerIn } from "common/FFmpegWorkerIn";
import { FFmpegWorkerOut } from "common/FFmpegWorkerOut";
import { TTYOutput } from "./TTYOutput";

const TTY_DIR = "huge";

const post = (message:FFmpegWorkerOut, options?:StructuredSerializeOptions) => self.postMessage(message, options);

self.onmessage = async (event) => {
	const {args, files} = event.data as FFmpegWorkerIn;
	const wasmUrl = URL.createObjectURL(files.find(file => file.name === Const.FFMPEG_WASM_FILENAME)!);
	const ffmpegUrl = URL.createObjectURL(files.find(file => file.name === Const.FFMPEG_JS_FILENAME)!);
	const ffmpegWorkerUrl = URL.createObjectURL(files.find(file => file.name === Const.FFMPEG_WORKER_FILENAME)!);

	// Worker is module so `importScripts(ffmpegUrl)` is not available...
	// but this little hack makes createFFmpeg available instead importScripts
	(<any>self).define = (_:any, c:any) => (<any>self).createFFmpeg = c();
	(<any>self).define.amd = true;
	await import(ffmpegUrl);
	delete (<any>self).define;

	const wasmMemory = new WebAssembly.Memory({initial:2048, maximum:65536, shared:true});
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
		tty:(stream, buffer, offset, length) => {
			const output = ttyOutputs[stream.path];
			if(!output)
				return false;
			if(length)
				output.push(buffer.slice(offset, offset + length).buffer);
			return true;
		},
		printErr:console.log,
		locateFile:url => {
			if(url.endsWith(".wasm")) return wasmUrl;
			if(url.endsWith(".worker.js")) return ffmpegWorkerUrl;
			return url;},
		mainScriptUrlOrBlob:ffmpegUrl, wasmMemory});

	const FS = module.FS;

	// mount all blobs and symlink each to root
	const WORKERFS = "workerfs"
	FS.mkdir(WORKERFS);
	FS.mount(module.WORKERFS, {files}, WORKERFS);
	for(const filename of FS.readdir(`/${WORKERFS}`))
		if(filename !== "." && filename !== "..")
			FS.symlink(`/${WORKERFS}/${filename}`, `/${filename}`);

	// prepare tty outputs
	const ttyOutputs:Record<string, TTYOutput> = {};
	const ttyEntries = getTTYEntries(args);
	const {mode, rdev} = FS.stat("/dev/tty");
	FS.mkdir(TTY_DIR);
	for(const {arg, filename} of ttyEntries) {
		FS.mknod(arg, mode, rdev);
		const type = ContentType.getMimeType(filename);
		ttyOutputs[`/${arg}`] = new TTYOutput(filename, type);
	}

	// store the original content
	const dirContent = FS.readdir("/");

	module.onExit = () => {
		const files = [];
		for(const filename of FS.readdir("/"))
			if(!dirContent.includes(filename)) {
				// report all new files
				const content = FS.readFile(filename);
				const type = ContentType.getMimeType(filename);
				const options = type ? {type} : undefined;
				files.push(new File([content.buffer], filename, options));
			}
		for(const ttyOutput of Object.values(ttyOutputs)) {
			const file = ttyOutput.flush();
			if(file)
				files.push(file);
		}

		post({kind:"onExit", files});
	}
	module.callMain(args);
}

function getTTYEntries(args:ReadonlyArray<string>) {
	const result = [];
	for(const arg of args) {
		if(arg.startsWith(`${TTY_DIR}/`)) {
			const filename = arg.substring(5);
			if(filename)
				result.push({arg, filename});

		}
	}
	return result;
}