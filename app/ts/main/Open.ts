import { System } from "type/System";

export class Open {
	private readonly system:System;

	constructor(system:System) {
		this.system = system;
	}

	run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			open(URL.createObjectURL(file), "_blank");
		}
	}
}