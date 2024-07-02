import { Program } from "~program/Program";
import { System } from "~type/System";

export class RM extends Program {
	constructor(system:System) {
		super("rm", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		for(const name of args) {
			try {
				fileSystem.remove(name);
				terminal.stdout(`File ${name} was removed.`);
			} catch(error) {}
		}
	}
}