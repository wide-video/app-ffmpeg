import { Program } from "~program/Program";
import { System } from "~type/System";

export class Open extends Program {
	constructor(system:System) {
		super("open", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			open(URL.createObjectURL(file), "_blank");
		}
	}
}