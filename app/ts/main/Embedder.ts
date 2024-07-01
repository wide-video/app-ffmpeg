import * as DOM from "./DOM";
import { System } from "type/System";

export class Embedder {
	private readonly system:System;

	constructor(system:System) {
		this.system = system;
	}

	run(args:ReadonlyArray<string>) {
		const {fileSystem, terminal} = this.system;
		for(const filename of args) {
			const file = fileSystem.get(filename);
			const iframe = DOM.iframe("embed");
			iframe.src = URL.createObjectURL(file);
			iframe.onload = () => {
				const style = DOM.style();
				style.textContent = "img {max-width:100%; height:100%}";
				iframe.contentDocument?.body.append(style);
			}
			terminal.stdout(iframe);
		}
	}
}