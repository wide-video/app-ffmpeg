export class TerminalCommand {
	private readonly element:HTMLElement;

	constructor(element:HTMLElement) {
		this.element = element;
	}

	setState(value:"running" | "success" | "error") {
		const {classList} = this.element;
		classList.remove("running", "success", "error");
		classList.add(value);
	}
}