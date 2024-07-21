import * as DOM from "~util/DOM";
import { Program } from "~program/Program";
import * as ProgramUtil from "~util/ProgramUtil";
import { System } from "~type/System";

export class Add extends Program {
	constructor(system:System) {
		super("add", system);
	}

	override async run(_args:ReadonlyArray<string>, signal:AbortSignal) {
		let files:File[];
		if(typeof showOpenFilePicker === "function") {
			try {
				files = await pickFileWithPicker({multiple:true})
			} catch(error) {
				// TODO DEP https://github.com/WICG/file-system-access/issues/245
				if(error instanceof DOMException && error.name === "SecurityError")
					files = await pickFileWithInput({multiple:true});
				else
					throw error;
			}
		} else {
			files = await pickFileWithInput({multiple:true})
		}

		ProgramUtil.addFiles(files, this.system, signal);
	}

	override help() {
		return this.joinSections(this.manTemplate({
			description: ["Adds files to the virtual file system."]}));
	}
}

async function pickFileWithPicker(options?:OpenFilePickerOptions):Promise<File[]> {
	const handles = await showOpenFilePicker(options);
	const promises = [];
	for(const handle of handles) 
		if(handle.kind === "file")
			promises.push(handle.getFile());
	return Promise.all(promises);
}

function pickFileWithInput(options?:OpenFilePickerOptions):Promise<File[]> {
	return new Promise((resolve, reject) => {
		const controller = new AbortController();
		const signal = controller.signal;
		const input = DOM.input();
		input.type = "file";
		if(options?.multiple)
			input.multiple = options.multiple;
		if(options?.types?.length) {
			input.accept = "";
			options.types.forEach(type => 
				Object.keys(type.accept).forEach(key => 
					input.accept += `${key},${type.accept[key]?.join(",")}`));
		}
		input.addEventListener("change", () => {
			controller.abort();
			resolve(input.files?.length ? Array.from(input.files) : []);
		}, {signal});
		document.body.addEventListener("mousemove", () => {
			controller.abort();
			reject("The user aborted a request.");
		}, {signal});
		window.addEventListener("focus", () => setTimeout(() => {
			controller.abort();
			reject("The user aborted a request.");
		}, 100), {signal});
		input.click();
	})
}