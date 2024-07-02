import { Program } from "~program/Program";
import { System } from "~type/System";

export class History extends Program {
	constructor(system:System) {
		super("history", system);
	}

	override run() {
		const {shell, terminal:{history}} = this.system;
		for(const command of history.getList())
			shell.print(command);
	}
}