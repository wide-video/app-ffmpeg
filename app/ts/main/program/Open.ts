import { Program } from "~program/Program";

export const COMMAND = "open";

export class Open extends Program {
	override run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			open(URL.createObjectURL(file), "_blank");
		}
	}
}