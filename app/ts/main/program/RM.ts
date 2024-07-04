import { Program } from "~program/Program";
import { System } from "~type/System";

export class RM extends Program {
	constructor(system:System) {
		super("rm", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		for(const name of fileSystem.getFilenames(args)) {
			fileSystem.remove(name);
			terminal.stdout(`File ${name} was removed.`);
		}
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Removes files from the virtual file system."],
			examples: [
				{description:"Remove file video.mp4:", command:`${this.name} video.mp4`},
				{description:"Remove all .mp4 files starting with output:", command:`${this.name} output*.mp4`}]}));
	}
}