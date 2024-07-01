import { ITerminal } from "~type/ITerminal";

export class FileSystem {
	private readonly terminal:ITerminal;
	private readonly map:Record<string, File> = {};

	constructor(terminal:ITerminal) {
		this.terminal = terminal;
	}

	get list() {
		return Object.values(this.map).sort((a, b) => a.name.localeCompare(b.name));
	}

	get(filename:string) {
		const result = this.map[filename];
		if(!result)
			throw `File ${filename} does not exist.`;
		return result;
	}

	add(files:ReadonlyArray<File> | FileList) {
		for(const file of files)
			this.map[file.name] = file;
	}

	runLS(args:ReadonlyArray<string>) {
		let list = this.list;
		if(args.length)
			list = list.filter(({name}) => args.includes(name));
		for(const file of list) {
			this.terminal.stdout(`${file.size}`.padStart(9) + ` ${file.name}`);
		}
	}

	runRM(args:ReadonlyArray<string>) {
		const {map, terminal} = this;
		for(const name of args) {
			if(map[name]) {
				delete map[name];
				terminal.stdout(`File ${name} deleted.`);
			}
		}
	}
}