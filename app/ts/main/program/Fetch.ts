import * as ContentType from "common/ContentType";
import { Program } from "~program/Program";
import { System } from "~type/System";

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
			const name = filename || new URL(url).pathname.split("/").pop() || "download.bin";
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

			const type = blob.type || ContentType.getMimeType(name);
			const file = new File([blob], name, type ? {type} : undefined);
			fileSystem.add([file]);
			terminal.stdout("Fetched 1 file:");
			shell.subprocess(`ls ${name}`, signal);
		} catch(error) {
			signal.throwIfAborted();
			throw error;
		} 
	}
}