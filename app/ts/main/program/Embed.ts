import * as BlobUtil from "~util/BlobUtil";
import * as DOM from "~util/DOM";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Embed extends Program {
	constructor(system:System) {
		super("embed", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {name, system:{fileSystem, terminal}} = this;
		if(!args.length)
			return;

		const container = DOM.div(name);
		for(const filename of args) {
			const file = fileSystem.get(filename);
			const iframe = DOM.iframe();
			iframe.src = BlobUtil.url(file);
			iframe.addEventListener("load", () => {
				const element = iframe.contentDocument?.body?.firstElementChild;
				if(element?.tagName === "IMG") {
					const img = element as HTMLImageElement;
					img.style.maxWidth = "100%";
					img.style.maxHeight = "100%";
					if(img.clientWidth < iframe.clientWidth)
						iframe.style.width = `${img.clientWidth}px`;
					else if(img.clientHeight < iframe.clientHeight)
						iframe.style.height = `${img.clientHeight}px`;
				}
			});
			container.append(iframe);
			
		}
		terminal.stdout(container);
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Displays the file in the terminal."],
			examples: [{description:"Play video.mp4:", command:`${this.name} video.mp4`}]}));
	}
}