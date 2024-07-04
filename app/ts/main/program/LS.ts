import { Program } from "~program/Program";
import { System } from "~type/System";

export class LS extends Program {
	constructor(system:System) {
		super("ls", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		let list = fileSystem.list;
		if(args.length)
			list = list.filter(({name}) => args.includes(name));
		for(const file of list)
			terminal.stdout(`${file.size}`.padStart(9) + ` ${file.name}`);
	}

	override man() {
		const name = this.name;
		return this.joinSections(this.manTemplate({
			description: ["Prints details of files in the virtual file system."],
			examples: [
				{description:"All files:", command:name},
				{description:"File a.mp4 and b.mp4:", command:`${name} a.mp4 b.mp4`}]}));
	}
}