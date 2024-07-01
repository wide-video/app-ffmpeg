import * as DOM from "~util/DOM";
import { Program } from "~program/Program";

export const COMMAND = "save";

export class Save extends Program {
	override async run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			if(showSaveFilePicker) {
				const handle = await showSaveFilePicker({suggestedName:filename});
				const writable = await handle.createWritable();
				await writable.write(file);
				await writable.close();
			} else {
				const a = DOM.a();
				a.download = filename;
				a.href = URL.createObjectURL(file);
				a.click();
			}
		}
	}
}