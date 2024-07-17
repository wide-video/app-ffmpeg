import { Command } from "~type/Command";
import { FFMPEG } from "~/Const";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Set extends Program {
	constructor(system:System) {
		super("set", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {env, terminal} = this.system;
		const variable = args[0] ?? "";
		if(!variable) {
			for(const [variable, value] of Object.entries(env))
				terminal.stdout(`${variable}=${value}`);
			return;
		}

		const value = args[1] ?? "";
		if(!value)
			throw "Value missing.";
		(<any>env)[variable] = value;
	}

	override help() {
		const name = this.name;
		return this.joinSections(this.manTemplate({
			description: ["Displays, or sets environment variables:"],
			examples: [
				{description:"Display all variables:", command:name},
				{description:"Set value into variable:", command:`${name} MY_VARIABLE MY_VALUE`},
				{description:"Use LGPL FFmpeg:", command:<Command>Object.entries(FFMPEG.LGPL)
					.map(([variable, value]) => `${name} ${variable} ${value}`)
					.join("\n")}]}));
	}
}