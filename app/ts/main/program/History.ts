import { Program } from "~program/Program";
import { System } from "~type/System";

export class History extends Program {
	constructor(system:System) {
		super("history", system);
	}

	override run() {
		const terminal = this.system.terminal;
		for(const command of terminal.history.getList())
			for(const html of this.commandToHTMLElements(command))
				terminal.stdout(html);
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: [`Prints the last ${this.system.terminal.history.max} executed commands.`]}));
	}
}