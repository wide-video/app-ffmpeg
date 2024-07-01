import * as DOM from "~util/DOM";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Embed extends Program {
	constructor(system:System) {
		super("embed", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			const iframe = DOM.iframe("embed");
			iframe.src = URL.createObjectURL(file);
			iframe.addEventListener("load", () => {
				const style = DOM.style();
				style.textContent = "img {max-width:100%; height:100%}";
				iframe.contentDocument?.body.append(style);
			});
			terminal.stdout(iframe);
		}
	}
}