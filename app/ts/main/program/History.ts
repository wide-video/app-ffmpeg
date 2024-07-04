import { Program } from "~program/Program";
import { System } from "~type/System";

export class History extends Program {
	constructor(system:System) {
		super("history", system);
	}

	override run() {
		const terminal = this.system.terminal;
		for(const command of terminal.history.getList())
			for(const html of this.htmlCommand(command))
				terminal.stdout(html);
	}
}