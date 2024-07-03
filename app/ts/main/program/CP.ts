import { Program } from "~program/Program";
import { System } from "~type/System";

export class CP extends Program {
	constructor(system:System) {
		super("cp", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		const source = args[0] ?? "";
		const target = args[1] ?? "";
		fileSystem.copy(source, target);
		terminal.stdout(`${source} was copied into ${target}`);
	}
}