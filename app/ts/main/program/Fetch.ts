import * as BlobUtil from "~util/BlobUtil";
import { Program } from "~program/Program";
import * as ProgramUtil from "~util/ProgramUtil";
import { System } from "~type/System";
import * as UrlUtil from "~util/UrlUtil";

export class Fetch extends Program {
	constructor(system:System) {
		super("fetch", system);
	}

	override async run(args:ReadonlyArray<string>, signal:AbortSignal) {
		const {fileSystem, shell, terminal} = this.system;
		const [url, filename] = args;
		if(!url)
			throw `Missing url`;
		try {
			const name = filename || UrlUtil.getFilename(url) || "download.bin";
			const response = await fetch(url, {signal});
			if(!response.ok)
				throw `Failed to Fetch: ${response.status} ${response.statusText}`;
			
			// https://stackoverflow.com/questions/76984567/http-header-for-decompressed-length/78699196
			const headers = response.headers;
			const contentLength = headers.get("x-decompressed-content-length")
				?? headers.get("x-amz-decoded-content-length")
				?? headers.get("x-content-length")
				?? headers.get("content-length")
				?? "?";
			let loaded = 0;
			const progressResponse = new Response(new ReadableStream({
				async start(controller) {
					const reader = response.body!.getReader();
					while(true) {
						const {done, value} = await reader.read();
						if(done) break;
						loaded && terminal.clearLine();
						loaded += value.byteLength;
						terminal.stdout(`Fetching ${name}: ${loaded} bytes of ${contentLength} loaded.`);
						controller.enqueue(value);
					}
					controller.close();
				},
			}));

			const blob = await progressResponse.blob();
			signal.throwIfAborted();

			terminal.clearLine();
			terminal.stdout(`Fetching ${name} completed:`);
			fileSystem.add([BlobUtil.toFile(blob, name)]);
			ProgramUtil.ls([name], shell, signal);
		} catch(error) {
			signal.throwIfAborted();
			throw error;
		} 
	}

	override help() {
		const name = this.name;
		return this.joinSections(this.manTemplate({
			description: ["Downloads a file from a URL into the virtual file system."],
			examples: [
				{description:"Download url:", command:`${name} https://mydomain.com/video.mp4`},
				{description:"Download url as video.mp4:", command:`${name} https://mydomain.com/xyz video.mp4`}]}));
	}
}