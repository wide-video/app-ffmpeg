import { NamedBlob } from "common/NamedBlob";

export class FileSystem {
	private readonly map:Record<string, Blob> = {};

	get list():ReadonlyArray<NamedBlob> {
		return Object.entries(this.map)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([name, data]) => ({name, data}));
	}

	get(filename:string) {
		const result = this.map[filename];
		if(!result)
			throw `File ${filename} does not exist.`;
		return result;
	}

	getFilenames(patterns:ReadonlyArray<string>) {
		const result:string[] = [];
		loop:for(const filename of Object.keys(this.map))
			for(const pattern of patterns) {
				if(filename === pattern
					|| filename.match(new RegExp(`^${pattern.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&').replaceAll("*", ".+")}$`))) {
					result.push(filename);
					continue loop;
				}
			}
		return result;
	}

	add(name:string, blob:Blob) {
		this.map[name] = blob;
	}

	addFiles(files:ReadonlyArray<File> | FileList) {
		for(const file of files)
			this.add(file.name, file);
	}

	copy(source:string, target:string) {
		if(!source)
			throw "Source filename missing.";
		if(!target)
			throw "Target filename missing.";
		if(source === target)
			throw "Source and target filenames are equal.";
		this.add(target, this.get(source));
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