import * as DOM from "~util/DOM";
import { Program } from "~program/Program";

export const COMMAND = "embed";

export class Embed extends Program {
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