import { COMMAND as HistoryCommand } from "~util/History";
import { COMMAND_CLEAR as ClearCommand } from "~util/Terminal";
import { Command } from "~type/Command";
import * as CommandParser from "~util/CommandParser"
import * as DOM from "~util/DOM";
import { Embed, COMMAND as EmbedCommand } from "~program/Embed";
import { Fetch, COMMAND as FetchCommand } from "~program/Fetch";
import { FFmpeg, COMMAND as FFmpegCommand } from "~program/FFmpeg";
import * as FileSystem from "~util/FileSystem";
import { Help, COMMAND as HelpCommand } from "~program/Help";
import { Open, COMMAND as OpenCommand } from "~program/Open";
import { PROMPT_PREFIX } from "~util/Terminal";
import { Save, COMMAND as SaveCommand } from "~program/Save";
import { System } from "~type/System";
import { ParsedCommand } from "~type/ParsedCommand";

export class Shell {
	private controller:AbortController | undefined;

	private readonly system:System;
	private readonly embed:Embed;
	private readonly fetch:Fetch;
	private readonly ffmpeg:FFmpeg;
	private readonly help:Help;
	private readonly open:Open;
	private readonly save:Save;

	constructor(system:System) {
		this.system = system;
		this.embed = new Embed(system);
		this.fetch = new Fetch(system);
		this.ffmpeg = new FFmpeg(system);
		this.help = new Help(system);
		this.open = new Open(system);
		this.save = new Save(system);
	}

	kill() {
		this.controller?.abort("The terminal process terminated with exit code: 1.");
		this.controller = undefined;
	}

	async run(line:Command, controllerOrSignal:AbortController | AbortSignal, printPrompt?:boolean) {
		const {embed, fetch, ffmpeg, help, open, save, system} = this;
		const {fileSystem, terminal} = system;
		const parsed = CommandParser.parse(line);
		if(printPrompt)
			this.printLine(line, parsed, PROMPT_PREFIX);

		if(!parsed)
			throw "Invalid command";
		
		const {command, args} = parsed;
		const controller = controllerOrSignal instanceof AbortController ? controllerOrSignal : undefined;
		const signal = controllerOrSignal instanceof AbortController ? controllerOrSignal.signal : controllerOrSignal;
		if(controller)
			this.controller = controller;
		try {
			switch(command.toLowerCase()) {
				case ClearCommand: return terminal.clear();
				case EmbedCommand: return embed.run(args);
				case FetchCommand: return await fetch.run(args, signal);
				case FFmpegCommand: return await ffmpeg.run(args, signal);
				case HelpCommand: return help.run(args);
				case HistoryCommand: return this.runHistory();
				case FileSystem.COMMAND_LS: return fileSystem.runLS(args);
				case OpenCommand: return open.run(args);
				case FileSystem.COMMAND_RM: return fileSystem.runRM(args);
				case SaveCommand: return await save.run(args);
			}
			throw `Command not found: ${command}`;
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
		for(const line of this.system.history.getList())
			this.printLine(line, CommandParser.parse(line));
	}

	private printLine(line:string, parsed:ParsedCommand | undefined, prefix="") {
		const terminal = this.system.terminal;
		if(!parsed)
			return terminal.stdout(`${prefix}${line}`);

		const {args, command} = parsed;
		const commandElement = DOM.span("command");
		commandElement.textContent = command;
	
		const lineElement = DOM.span("prompt");
		lineElement.append(prefix, commandElement);
		for(const arg of args) {
			const element = DOM.span("arg");
			if(!isNaN(Number(arg)))
				element.classList.add("number");
			else if(arg.startsWith("-"))
				element.classList.add("modifier");
			element.textContent = arg;
			lineElement.append(" ", element);
		}
		terminal.stdout(lineElement);
	}
}
