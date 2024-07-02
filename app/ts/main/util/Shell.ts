import { Add } from "~program/Add";
import * as ArgsUtil from "~util/ArgsUtil";
import { Clear } from "~program/Clear";
import { Command } from "~type/Command";
import { CP } from "~program/CP";
import * as CommandParser from "~util/CommandParser";
import * as DOM from "~util/DOM";
import { Embed } from "~program/Embed";
import { Fetch } from "~program/Fetch";
import { FFmpeg } from "~program/FFmpeg";
import { Help } from "~program/Help";
import { History } from "~program/History";
import { IShell } from "~type/IShell";
import { LS } from "~program/LS";
import { MV } from "~program/MV";
import { Open } from "~program/Open";
import { Save } from "~program/Save";
import { System } from "~type/System";
import { ParsedCommand } from "~type/ParsedCommand";
import { Program } from "~program/Program";
import { ProgramName } from "~type/ProgramName";
import { RM } from "~program/RM";
import { Terminal } from "~util/Terminal";

export class Shell implements IShell {
	readonly system:System;
	readonly programs:ReadonlyArray<Program>;

	private controller:AbortController | undefined;

	constructor(terminal:Terminal) {
		const system = this.system = {fileSystem:terminal.fileSystem, shell:this, terminal};
		this.programs = [new Add(system), new Clear(system), new CP(system), new Embed(system),
			new Fetch(system), new FFmpeg(system), new Help(system), new History(system),
			new LS(system), new MV(system), new Open(system), new RM(system), new Save(system)];

		terminal.init(this.process.bind(this), this.kill.bind(this));
	}

	process(command:Command, printCommand=true) {
		if(this.controller)
			throw "Process in progress.";
		return this.run(command, new AbortController(), printCommand);
	}

	subprocess(command:Command, signal:AbortSignal) {
		return this.run(command, signal);
	}

	print(command:Command) {
		this.printCommand(command, CommandParser.parse(command));
	}

	private kill() {
		this.controller?.abort("The terminal process was aborted.");
		this.controller = undefined;
	}

	private async run(command:Command, controllerOrSignal:AbortController | AbortSignal, printCommand?:boolean) {
		const {programs, system:{terminal}} = this;
		const parsed = CommandParser.parse(command);
		if(printCommand)
			this.printCommand(command, parsed, terminal.prefix);

		if(!parsed)
			throw "Invalid command";
		
		const {args, program} = parsed;
		const controller = controllerOrSignal instanceof AbortController ? controllerOrSignal : undefined;
		const signal = controllerOrSignal instanceof AbortController ? controllerOrSignal.signal : controllerOrSignal;
		if(controller)
			this.controller = controller;
		try {
			const name = program.toLowerCase() as ProgramName;
			for(const program of programs)
				if(program.name === name)
					return await program.run(args, signal);
			throw `Command not found: ${program}`;
		} catch(error) {
			// subprocesses bubbles the same exceptions up, but we only log it once
			if(controller)
				terminal.stderr(`${error}`);
			throw error;
		} finally {
			if(controller === this.controller)
				this.controller = undefined;
		}
	}

	private printCommand(command:string, parsed:ParsedCommand | undefined, prefix="") {
		const terminal = this.system.terminal;
		if(!parsed)
			return terminal.stdout(`${prefix}${command}`);

		const {args, program} = parsed;
		const programElement = DOM.span("program", program);
	
		const commandElement = DOM.span("command", [prefix, programElement]);
		for(const arg of args) {
			const element = DOM.span("arg", ArgsUtil.escape(arg));
			if(!isNaN(Number(arg)))
				element.classList.add("number");
			else if(arg.startsWith("-"))
				element.classList.add("modifier");
			commandElement.append(" ", element);
		}
		terminal.stdout(commandElement);
	}
}