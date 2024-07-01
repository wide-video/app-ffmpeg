import * as ContentType from "common/ContentType"
import { Program } from "~program/Program";

export const COMMAND = "fetch";

export class Fetch extends Program {
	override async run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		const [url, filename] = args;
		if(!url)
			throw `Missing url`;
		const name = filename || new URL(url).pathname.split("/").pop() || "download.bin";
		const response = await fetch(url);
		if(!response.ok)
			throw `Failed to Fetch: ${response.status} ${response.statusText}`;
		
		const contentLength = response.headers.get("content-length") ?? "?";
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
		const type = blob.type || ContentType.getMimeType(name);
		const file = new File([blob], name, type ? {type} : undefined);
		fileSystem.add([file]);
		terminal.stdout("Fetched 1 file:");
		terminal.execute(`ls ${name}`, false);
	}
}