import * as CommandParser from "./CommandParser"
import * as DOM from "./DOM";
import { Embedder } from "./Embedder";
import { Fetch } from "./Fetch";
import { FFmpeg } from "./FFmpeg";
import { Open } from "./Open";
import { PROMPT_PREFIX } from "./Terminal";
import { Save } from "./Save";
import { System } from "type/System";
import { ParsedCommand } from "type/ParsedCommand";

export class Shell {
	private readonly system:System;
	private readonly embedder:Embedder;
	private readonly fetch:Fetch;
	private readonly ffmpeg:FFmpeg;
	private readonly open:Open;
	private readonly save:Save;

	constructor(system:System) {
		this.system = system;
		this.embedder = new Embedder(system);
		this.fetch = new Fetch(system);
		this.ffmpeg = new FFmpeg(system);
		this.open = new Open(system);
		this.save = new Save(system);
	}

	async run(line:string, printPrompt?:boolean) {
		const {embedder, fetch, ffmpeg, open, save, system} = this;
		const {fileSystem, terminal} = system;
		const parsed = CommandParser.parse(line);
		if(printPrompt)
			this.printLine(line, parsed, PROMPT_PREFIX);

		if(!parsed)
			throw "Invalid command";
		
		const {command, args} = parsed;
		try {
			
			switch(command.toLowerCase()) {
				case "clear": return terminal.clear();
				case "embed": return embedder.run(args);
				case "fetch": return await fetch.run(args);
				case "ffmpeg": return await ffmpeg.run(args);
				case "help": return this.runHelp();
				case "history": return this.runHistory();
				case "ls": return fileSystem.runLS(args);
				case "open": return open.run(args);
				case "rm": return fileSystem.runRM(args);
				case "save": return await save.run(args);
			}
			throw `Command not found: ${command}`;
		} catch(error) {
			terminal.stderr(`${error}`);
		}
	}

	runHelp() {
		this.system.terminal.stdout("this is help");
	}

	runHistory() {
		for(const line of this.system.history.getList())
			this.printLine(line, CommandParser.parse(line));
	}

	printLine(line:string, parsed:ParsedCommand | undefined, prefix="") {
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
