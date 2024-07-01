import { System } from "~type/System";

export abstract class Program {
	protected readonly system:System;

	constructor(system:System) {
		this.system = system;
	}

	run(_args:ReadonlyArray<string>, _signal:AbortSignal):void | Promise<void> {
		throw "Program not implemented";
	}
}