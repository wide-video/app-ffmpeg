import * as DOM from "~util/DOM";
import * as Format from "~util/Format";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Help extends Program {
	constructor(system:System) {
		super("help", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {name, system:{shell, terminal}} = this;
		const programName = args[0];
		const program = programName ? shell.getProgram(programName) : undefined;
		const element = DOM.div("help");
		element.innerHTML = program	? program.help() :
			this.joinSections(this.manTemplate({
				description:["Print detailed help and examples for the specified program."],
				examples:[
					{description: "Print this help:",
					command:name},
					{description: `Print help for a program:`
						+ `${Format.NLI}Available programs: ${shell.programs.map(program => this.commandToHTMLStrings(program.name)[0]).join(", ")}`,
					command:`${name} <program>`}]}));
		terminal.stdout(element);
	}
}