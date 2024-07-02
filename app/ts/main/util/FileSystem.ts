export class FileSystem {
	private readonly map:Record<string, File> = {};

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

	copy(source:string, target:string) {
		const file = this.get(source);
		const type = file.type;
		this.add([new File([file], target, type ? {type} : undefined)]);
	}

	remove(filename:string) {
		this.get(filename); // throws error
		delete this.map[filename];
	}

	rename(source:string, target:string) {
		this.copy(source, target);
		this.remove(source);
	}
}