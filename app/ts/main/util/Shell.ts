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
import { PrintedCommand } from "./PrintedCommand";
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
		const parsed = CommandParser.parse(command);
		if(parsed)
			for(const item of parsed)
				this.printCommand(command, item);
		else
			this.printCommand(command, undefined);
	}

	private kill() {
		this.controller?.abort("The terminal process was aborted.");
		this.controller = undefined;
	}

	private async run(command:Command, controllerOrSignal:AbortController | AbortSignal, printCommand?:boolean) {
		const {programs, system:{terminal}} = this;
		const controller = controllerOrSignal instanceof AbortController ? controllerOrSignal : undefined;
		const signal = controllerOrSignal instanceof AbortController ? controllerOrSignal.signal : controllerOrSignal;
		const parsed = CommandParser.parse(command);
		let print:PrintedCommand | undefined;
		
		try {
			if(!parsed) {
				printCommand ? this.printCommand(command, undefined, terminal.prefix) : undefined;
				throw "Invalid command";
			}
			if(controller)
				this.controller = controller;
			for(const item of parsed) {
				print = printCommand ? this.printCommand(command, item, terminal.prefix) : undefined;
				print?.setState("running");

				const name = item.program.toLowerCase() as ProgramName;
				const program = programs.find(program => program.name === name);
				if(!program)
					throw `Command not found: ${name}`;

				await program.run(item.args, signal);
				print?.setState("success");
			}
		} catch(error) {
			print?.setState("error");
			// subprocesses bubbles the same exceptions up, but we only log it once
			if(controller)
				terminal.stderr(`${error}`);
			throw error;
		} finally {
			if(controller === this.controller)
				this.controller = undefined;
		}
	}

	private printCommand(command:string, parsed:ParsedCommand | undefined, prefix?:string) {
		const terminal = this.system.terminal;
		const content:(string | Element)[] = prefix ? [prefix] : [];
		if(parsed) {
			const {args, program} = parsed;
			content.push(DOM.span("program", program));
			for(const arg of args) {
				const element = DOM.span("arg", ArgsUtil.escape(arg));
				if(!isNaN(Number(arg)))
					element.classList.add("number");
				else if(arg.startsWith("-"))
					element.classList.add("modifier");
				content.push(" ", element);
			}
		} else {
			content.push(command);
		}
		return terminal.stdout(DOM.span("command", content));
	}
}