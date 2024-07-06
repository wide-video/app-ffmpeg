import * as BlobUtil from "~util/BlobUtil";
import * as ContentType from "common/ContentType";
import { Program } from "~program/Program";
import { System } from "~type/System";
import * as UrlUtil from "~util/UrlUtil";

export class Fetch extends Program {
	constructor(system:System) {
		super("fetch", system);
	}

	override async run(args:ReadonlyArray<string>, signal:AbortSignal) {
		const {fileSystem, terminal} = this.system;
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
						loaded += value.byteLength;
						terminal.clearLine("fetch-progress");
						terminal.stdout(`Fetching ${name}: ${loaded} bytes of ${contentLength} loaded.`, "fetch-progress");
						controller.enqueue(value);
					}
					controller.close();
				},
			}));

			let blob = await progressResponse.blob();
			signal.throwIfAborted();

			terminal.clearLine("fetch-progress");
			terminal.stdout(`Fetching ${name}: ${loaded} bytes loaded successfully.`);

			const type = blob.type || ContentType.getMimeType(name);
			if(type !== blob.type)
				blob = BlobUtil.toBlob(blob, type);
			fileSystem.add(name, blob);
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