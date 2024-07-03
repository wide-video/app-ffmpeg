import * as BlobUtil from "~util/BlobUtil";

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
		if(!source)
			throw "Source filename missing.";
		if(!target)
			throw "Target filename missing.";
		if(source === target)
			throw "Source and target filenames are equal."
		this.add([BlobUtil.toFile(this.get(source), target)]);
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