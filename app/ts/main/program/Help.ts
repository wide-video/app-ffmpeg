import { Program } from "~program/Program";

export const COMMAND = "help";

export class Help extends Program {
	override run(_args:ReadonlyArray<string>) {
		this.system.terminal.stdout("this is help");
	}
}