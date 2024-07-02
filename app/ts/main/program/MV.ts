import { Program } from "~program/Program";
import { System } from "~type/System";

export class MV extends Program {
	constructor(system:System) {
		super("mv", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		
		const source = args[0];
		if(!source)
			throw "Filename missing.";

		const target = args[1];
		if(!target)
			throw "New filename missing.";

		fileSystem.rename(source, target);
		terminal.stdout(`${source} was renamed to ${target}`);
	}
}