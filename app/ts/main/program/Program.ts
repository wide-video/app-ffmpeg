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
		throw "Program not implemented";
	}

	protected manTemplate(options:TemplateOptions):Section[] {
		const result:Section[] = [{name:"NAME", content:`<span class="program">${this.name}</span>`}];
		const {description, examples, synopsis} = options;
		if(synopsis?.length)
			result.push({name:"SYNOPSIS", content:synopsis
				.map(htmlCommand)
				.join(Format.NLI)});
		if(description?.length)
			result.push({name:"DESCRIPTION", content:description.join(Format.NLNLI)});
		if(examples?.length)
			result.push({name:"EXAMPLES", content:examples
				.map(({command, description}) => `${description}${Format.NLI}${htmlCommand(command)}`)
				.join(Format.NLNLI)});
		return result;
	}

	protected joinSections(sections:ReadonlyArray<Section>) {
		return sections
			.map(({name, content}) => `<strong>${name}</strong>${Format.NLI}${content}`)
			.join(Format.NLNL);
	}
}

const htmlCommand = (command:Command) =>
	Format.htmlCommand(command, CommandParser.parse(command)![0]).outerHTML;

type TemplateOptions = {
	readonly synopsis?:ReadonlyArray<Command> | undefined;
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