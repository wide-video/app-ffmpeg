import { FileSystem } from "~util/FileSystem";
import * as HTMLUtil from "~util/HTMLUtil";
import * as ProgramName from "~type/ProgramName";

export function complete(element:HTMLElement, fileSystem:FileSystem) {
	const selection = getSelection();
	if(!selection || selection.type !== "Caret")
		return;

	const textBefore = element.textContent?.substring(0, selection.anchorOffset);
	if(!textBefore)
		return;

	const textAfter = element.textContent?.substring(selection.anchorOffset) ?? "";
	const wordBefore = textBefore.split(/\s+/).pop() ?? textBefore;

	const options = [];
	for(const program of ProgramName.LIST)
		if(program.startsWith(textBefore)) {
			const chunk = program.substring(textBefore.length);
			if(chunk)
				options.push(chunk);
		}

	for(const {name} of fileSystem.list)
		if(name.startsWith(wordBefore)) {
			const chunk = name.substring(wordBefore.length);
			if(chunk)
				options.push(chunk);
		}

	let chunk = options.shift();
	if(!chunk)
		return;

	for(const option of options) {
		let newChunk = "";
		const length = Math.min(chunk.length, option.length);
		for(let i = 0; i < length; i++) {
			if(chunk[i] !== option[i])
				break;
			newChunk += chunk[i];
		}
		if(!newChunk)
			return;
		chunk = newChunk;
	}

	const newBefore = `${textBefore}${chunk}`;
	element.textContent = `${newBefore}${textAfter}`;
	HTMLUtil.caretToPosition(element, newBefore.length);
}