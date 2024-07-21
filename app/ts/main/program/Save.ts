import * as BlobUtil from "~util/BlobUtil";
import * as DOM from "~util/DOM";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Save extends Program {
	constructor(system:System) {
		super("save", system);
	}

	override async run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			if(typeof showSaveFilePicker === "function") {
				try {
					await saveFileWithPicker(filename, file)
				} catch(error) {
					// TODO dep https://github.com/WICG/file-system-access/issues/245
					if(error instanceof DOMException && error.name === "SecurityError")
						saveFileWithAnchor(filename, file);
					else
						throw error;
				}
			} else {
				saveFileWithAnchor(filename, file);
			}
		}
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Saves files from the virtual file system to the regular file system."],
			examples: [{description:"Save files:", command:`${this.name} a.mp4 b.mp4`}]}));
	}
}

async function saveFileWithPicker(filename:string, file:Blob) {
	const handle = await showSaveFilePicker({suggestedName:filename});
	const writable = await handle.createWritable();
	await writable.write(file);
	await writable.close();
}

function saveFileWithAnchor(filename:string, file:Blob) {
	const a = DOM.a();
	a.download = filename;
	a.href = BlobUtil.url(file);
	a.click();
}