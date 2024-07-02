import { Program } from "~program/Program";
import { System } from "~type/System";

export class Clear extends Program {
	constructor(system:System) {
		super("clear", system);
	}

	override run() {
		this.system.terminal.clear();
	}
}