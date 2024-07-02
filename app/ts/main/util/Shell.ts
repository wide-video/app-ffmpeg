import * as ArgsUtil from "~util/ArgsUtil"
import { Command } from "~type/Command";
import * as CommandParser from "~util/CommandParser"
import * as DOM from "~util/DOM";
import { Embed } from "~program/Embed";
import { Fetch } from "~program/Fetch";
import { FFmpeg } from "~program/FFmpeg";
import { Help } from "~program/Help";
import { IShell } from "~type/IShell";
import { Open } from "~program/Open";
import { Save } from "~program/Save";
import { System } from "~type/System";
import { ParsedCommand } from "~type/ParsedCommand";
import { Terminal } from "~util/Terminal";
import { ProgramName } from "~type/ProgramName";

export class Shell implements IShell {
	readonly system:System;

	private readonly embed:Embed;
	private readonly fetch:Fetch;
	private readonly ffmpeg:FFmpeg;
	private readonly help:Help;
	private readonly open:Open;
	private readonly save:Save;

	private controller:AbortController | undefined;

	constructor(terminal:Terminal) {
		const system = this.system = {fileSystem:terminal.fileSystem, shell:this, terminal};
		this.embed = new Embed(system);
		this.fetch = new Fetch(system);
		this.ffmpeg = new FFmpeg(system);
		this.help = new Help(system);
		this.open = new Open(system);
		this.save = new Save(system);

		terminal.init(this.process.bind(this), this.kill.bind(this));
	}

	process(command:Command, printPrompt=true) {
		if(this.controller)
			throw "Process in progress.";
		return this.run(command, new AbortController(), printPrompt);
	}

	subprocess(command:Command, signal:AbortSignal) {
		return this.run(command, signal);
	}

	private kill() {
		this.controller?.abort("The terminal process was aborted.");
		this.controller = undefined;
	}

	private async run(command:Command, controllerOrSignal:AbortController | AbortSignal, printPrompt?:boolean) {
		const {embed, fetch, ffmpeg, help, open, save, system} = this;
		const {fileSystem, terminal} = system;
		const parsed = CommandParser.parse(command);
		if(printPrompt)
			this.printCommand(command, parsed, terminal.prefix);

		if(!parsed)
			throw "Invalid command";
		
		const {args, program} = parsed;
		const controller = controllerOrSignal instanceof AbortController ? controllerOrSignal : undefined;
		const signal = controllerOrSignal instanceof AbortController ? controllerOrSignal.signal : controllerOrSignal;
		if(controller)
			this.controller = controller;
		try {
			switch(program.toLowerCase() as ProgramName) {
				case "clear": return terminal.clear();
				case embed.name: return embed.run(args);
				case fetch.name: return await fetch.run(args, signal);
				case ffmpeg.name: return await ffmpeg.run(args, signal);
				case help.name: return help.run(args);
				case "history": return this.runHistory();
				case "ls": return fileSystem.runLS(args);
				case open.name: return open.run(args);
				case "rm": return fileSystem.runRM(args);
				case save.name: return await save.run(args);
			}
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

	private runHistory() {
		for(const command of this.system.terminal.history.getList())
			this.printCommand(command, CommandParser.parse(command));
	}

	private printCommand(command:string, parsed:ParsedCommand | undefined, prefix="") {
		const terminal = this.system.terminal;
		if(!parsed)
			return terminal.stdout(`${prefix}${command}`);

		const {args, program} = parsed;
		const programElement = DOM.span("program");
		programElement.textContent = program;
	
		const promptElement = DOM.span("prompt");
		promptElement.append(prefix, programElement);
		for(const arg of args) {
			const element = DOM.span("arg");
			if(!isNaN(Number(arg)))
				element.classList.add("number");
			else if(arg.startsWith("-"))
				element.classList.add("modifier");
			element.textContent = ArgsUtil.escape(arg);
			promptElement.append(" ", element);
		}
		terminal.stdout(promptElement);
	}
}
