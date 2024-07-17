import { Command } from "~type/Command";
import * as CommandParser from "~util/CommandParser";
import * as Format from "~util/Format";
import { ProgramAliasName } from "~/type/ProgramAliasName";
import { ProgramName } from "~type/ProgramName";
import { System } from "~type/System";

export abstract class Program {
	readonly name:ProgramName;
	readonly alias:ReadonlyArray<ProgramAliasName> | undefined;

	protected readonly system:System;

	constructor(name:ProgramName, system:System) {
		this.name = name;
		this.system = system;
	}

	run(_args:ReadonlyArray<string>, _signal:AbortSignal):void | Promise<void> {
		throw `Program ${this.name} not implemented.`;
	}

	help():string {
		throw `Help for ${this.name} is not available.`;
	}

	protected commandToHTMLElements(command:Command):[HTMLElement, ...HTMLElement[]] {
		const parsed = CommandParser.parse(command);
		const result = [];
		if(parsed)
			for(const item of parsed)
				result.push(Format.htmlCommand(command, item));
		else
			result.push(Format.htmlCommand(command, undefined));
		return result as [HTMLElement, ...HTMLElement[]];
	}

	protected commandToHTMLStrings(command:Command):[string, ...string[]] {
		return this.commandToHTMLElements(command).map(html => html.outerHTML) as [string, ...string[]];
	}

	protected manTemplate(options:TemplateOptions):Section[] {
		const {alias, name} = this;
		const result:Section[] = [{name:"NAME",
			content:[this.commandToHTMLStrings(name)[0]
				+ (alias?.length ? ` (${alias.map(name => this.commandToHTMLStrings(name)[0]).join(", ")})` : "")]}];
		const {description, examples} = options;
		if(description?.length)
			result.push({name:"DESCRIPTION", content:description});
		if(examples?.length)
			result.push({name:"EXAMPLES", content:examples
				.map(({command, description}) =>
					`${description}${Format.NLI}${this.commandToHTMLStrings(command).join(Format.NLI)}`)});
		return result;
	}

	protected joinSections(sections:ReadonlyArray<Section>) {
		return sections
			.map(({name, content}) => `<strong>${name}</strong>${Format.NLI}${content.join(Format.NLNLI)}`)
			.join(Format.NLNL);
	}
}

type TemplateOptions = {
	readonly description?:ReadonlyArray<string> | undefined;
	readonly examples?:ReadonlyArray<Example> | undefined;
}

type Section = {
	readonly name:string;
	readonly content:ReadonlyArray<string>;
}

type Example = {
	readonly command:Command;
	readonly description:string;
}