import * as BlobUtil from "~util/BlobUtil";
import * as Fix from "~util/Fix";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Open extends Program {
	constructor(system:System) {
		super("open", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem} = this.system;
		for(const filename of args) {
			const file = Fix.makeEmbeddable(fileSystem.get(filename));
			open(BlobUtil.url(file), "_blank");
		}
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Opens a file in a new browser tab."],
			examples: [{description:"Open file video.mp4:", command:`${this.name} video.mp4`}]}));
	}
}