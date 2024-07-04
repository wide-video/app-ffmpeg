import { Command } from "~type/Command";
import * as CommandParser from "~util/CommandParser";
import * as Format from "~util/Format";
import { ProgramName } from "~type/ProgramName";
import { System } from "~type/System";

export abstract class Program {
	readonly name:ProgramName;
	protected readonly system:System;

	constructor(name:ProgramName, system:System) {
		this.name = name;
		this.system = system;
	}

	run(_args:ReadonlyArray<string>, _signal:AbortSignal):void | Promise<void> {
		throw "Program not implemented";
	}

	man():string {
		throw `Help for ${this.name} is not available`;
	}

	protected htmlCommands(command:Command):[HTMLElement, ...HTMLElement[]] {
		const parsed = CommandParser.parse(command);
		const result = [];
		if(parsed)
			for(const item of parsed)
				result.push(Format.htmlCommand(command, item));
		else
			result.push(Format.htmlCommand(command, undefined));
		return result as [HTMLElement, ...HTMLElement[]];
	}

	protected htmlStringCommands(command:Command):[string, ...string[]] {
		return this.htmlCommands(command).map(html => html.outerHTML) as [string, ...string[]];
	}

	protected manTemplate(options:TemplateOptions):Section[] {
		const result:Section[] = [{name:"NAME", content:this.htmlStringCommands(this.name)[0]}];
		const {description, examples} = options;
		if(description?.length)
			result.push({name:"DESCRIPTION", content:description.join(Format.NLNLI)});
		if(examples?.length)
			result.push({name:"EXAMPLES", content:examples
				.map(({command, description}) =>
					`${description}${Format.NLI}${this.htmlStringCommands(command)[0]}`)
				.join(Format.NLNLI)});
		return result;
	}

	protected joinSections(sections:ReadonlyArray<Section>) {
		return sections
			.map(({name, content}) => `<strong>${name}</strong>${Format.NLI}${content}`)
			.join(Format.NLNL);
	}
}

type TemplateOptions = {
	readonly description?:ReadonlyArray<string> | undefined;
	readonly examples?:ReadonlyArray<Example> | undefined;
}

type Section = {
	readonly name:string;
	readonly content:string;
}

type Example = {
	readonly command:Command;
	readonly description:string;
}