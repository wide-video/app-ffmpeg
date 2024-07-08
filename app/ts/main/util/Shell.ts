import { Add } from "~program/Add";
import { Bootstrap } from "~program/Bootstrap";
import { Clear } from "~program/Clear";
import { Command } from "~type/Command";
import { CP } from "~program/CP";
import * as CommandParser from "~util/CommandParser";
import { Embed } from "~program/Embed";
import { Fetch } from "~program/Fetch";
import { FFmpeg } from "~program/FFmpeg";
import * as Format from "~util/Format";
import { Help } from "~program/Help";
import { History } from "~program/History";
import { Intro } from "~program/Intro";
import { IShell } from "~type/IShell";
import { LS } from "~program/LS";
import { MV } from "~program/MV";
import { Open } from "~program/Open";
import { Save } from "~program/Save";
import { System } from "~type/System";
import { PrintedCommand } from "./PrintedCommand";
import { Program } from "~program/Program";
import { ProgramAliasName } from "~/type/ProgramAliasName";
import { ProgramName } from "~type/ProgramName";
import { RM } from "~program/RM";
import { Terminal } from "~util/Terminal";

export class Shell implements IShell {
	readonly system:System;
	readonly programs:ReadonlyArray<Program>;

	private controller:AbortController | undefined;

	constructor(terminal:Terminal) {
		const system = this.system = {fileSystem:terminal.fileSystem, shell:this, terminal};
		const ctors:ReadonlyArray<new (system:System) => Program> = [
			Add, Bootstrap, Clear, CP, Embed, Fetch, FFmpeg, Help, History, Intro,
			LS, MV, Open, RM, Save];
		this.programs = ctors.map(ctor => new ctor(system));

		terminal.init(this.process.bind(this), this.kill.bind(this));
	}

	getProgram(name:string) {
		const programs = this.programs;
		const programName = name.toLowerCase() as ProgramName;
		for(const program of programs)
			if(program.name === programName)
				return program;
		for(const program of programs)
			if(program.alias?.includes(programName as ProgramAliasName))
				return program;
		return;
	}

	process(command:Command, printCommand=true) {
		if(this.controller)
			throw "Process in progress.";
		return this.run(command, new AbortController(), printCommand);
	}

	subprocess(command:Command, signal:AbortSignal) {
		return this.run(command, signal);
	}

	private kill() {
		this.controller?.abort("The terminal process was aborted.");
		this.controller = undefined;
	}

	private async run(command:Command, controllerOrSignal:AbortController | AbortSignal, printCommand?:boolean) {
		const terminal = this.system.terminal;
		const controller = controllerOrSignal instanceof AbortController ? controllerOrSignal : undefined;
		const signal = controllerOrSignal instanceof AbortController ? controllerOrSignal.signal : controllerOrSignal;
		const parsed = CommandParser.parse(command);
		let print:PrintedCommand | undefined;
		
		try {
			if(!parsed) {
				printCommand ? terminal.stdout(Format.htmlCommand(command, undefined, true)) : undefined;
				throw "Invalid command";
			}
			if(controller)
				this.controller = controller;
			for(const item of parsed) {
				print = printCommand ? terminal.stdout(Format.htmlCommand(command, item, true)) : undefined;
				const program = this.getProgram(item.program);
				if(!program)
					throw `Command not found: ${item.program}`;

				print?.setState("running");
				await program.run(item.args, signal);
				print?.setState("success");
			}
		} catch(error) {
			print?.setState("error");
			// subprocesses bubbles the same exceptions up, but we only want to log it once
			if(controller)
				terminal.stderr(error instanceof Element ? error : `${error}`);
			throw error;
		} finally {
			if(controller === this.controller)
				this.controller = undefined;
		}
	}
}