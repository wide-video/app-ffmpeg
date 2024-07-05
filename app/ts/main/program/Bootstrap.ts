import * as DOM from "~util/DOM";
import * as Format from "~util/Format";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Bootstrap extends Program {
	constructor(system:System) {
		super("bootstrap", system);
	}

	override run(args:ReadonlyArray<string>) {
		const terminal = this.system.terminal;
		const quiet = args.includes("-quiet");
		let checks = [
			this.check("Web Workers", "https://caniuse.com/webworkers",
				typeof Worker === "function"),
			this.check("cross-origin isolation", "https://web.dev/articles/cross-origin-isolation-guide",
				typeof SharedArrayBuffer === "function"),
			this.check("Fixed-width SIMD", "https://webassembly.org/features/",
				supportsSimd())];
		if(quiet)
			checks = checks.filter(check => !check.success);
		const message = DOM.span();
		message.innerHTML = checks.map(check => check.message).join(Format.NL);
		if(checks.find(check => !check.success))
			throw message;
		terminal.stdout(message);
	}

	private check(feature:string, url:string, success:boolean) {
		const message = `Checking ${Format.link(url, feature)}${"".padEnd(24 - feature.length, " ")} ${success ? "OK" : "FAIL"}`;
		return {message, success};
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Checks system dependencies to ensure that all necessary features are available."],
			examples: [
				{description: "Avoid printing except in cases of check failures.",
				command:"bootstrap -quiet"}
			]}));
	}
}

function supportsSimd() {
	try {
		return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5,
			1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
	} catch(error) {
		return false;
	}
}