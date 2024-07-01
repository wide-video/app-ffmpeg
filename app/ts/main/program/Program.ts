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
}