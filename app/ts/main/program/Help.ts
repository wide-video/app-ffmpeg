import { Program } from "~program/Program";
import { System } from "~type/System";

export class Help extends Program {
	constructor(system:System) {
		super("help", system);
	}

	override run(_args:ReadonlyArray<string>) {
		this.system.terminal.stdout("this is help");
	}
}