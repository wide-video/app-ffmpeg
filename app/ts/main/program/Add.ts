import * as DOM from "~util/DOM";
import * as ProcessUtil from "~util/ProcessUtil";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Add extends Program {
	constructor(system:System) {
		super("add", system);
	}

	override async run(_args:ReadonlyArray<string>, signal:AbortSignal) {
		const files = showOpenFilePicker !== undefined
			? await pickFileWithPicker({multiple:true})
			: await pickFileWithInput({multiple:true});
		ProcessUtil.addFiles(files, this.system, signal);
	}
}

async function pickFileWithPicker(options?:OpenFilePickerOptions):Promise<File[]> {
	try {
		const handles = await showOpenFilePicker(options);
		const promises = [];
		for(const handle of handles) 
			if(handle.kind === "file")
				promises.push(handle.getFile());
		return Promise.all(promises);
	} catch(error) {
		return [];
	}
}

function pickFileWithInput(options?:OpenFilePickerOptions):Promise<File[]> {
	return new Promise(resolve => {
		const complete = () => {
			input.removeEventListener("change", complete);
			document.body.removeEventListener("mousemove", complete);
			resolve(input.files?.length ? Array.from(input.files) : []);
		}
		const onWindowFocus = () => {
			window.removeEventListener("focus", onWindowFocus);
			setTimeout(complete, 100);
		}
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
		input.addEventListener("change", complete);
		input.click();
		document.body.addEventListener("mousemove", complete);
		window.addEventListener("focus", onWindowFocus);
	})
}