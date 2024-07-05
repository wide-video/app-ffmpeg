import { Command } from "~type/Command";
import * as CommandParser from "~util/CommandParser";
import * as DOM from "~util/DOM";
import * as Format from "~util/Format";
import * as ProgramUtil from "~util/ProgramUtil";
import { Shell } from "~util/Shell";
import { Terminal } from "~util/Terminal";

const body = document.body;
const root = document.getElementById("Terminal")!;

async function init(command:Command, printCommand:boolean) {
	const terminal = new Terminal(root);
	const shell = new Shell(terminal);
	terminal.focus();

	body.addEventListener("drop", event => {
		event.preventDefault();
		body.classList.remove("dragOver");
		ProgramUtil.addFiles(event.dataTransfer?.files, shell.system, new AbortController().signal);
	})
	
	body.addEventListener("dragleave", event => {
		if(body === event.target)
			body.classList.remove("dragOver"); 
	})
	
	body.addEventListener("dragover", event => {
		event.preventDefault();
		body.classList.add("dragOver");
	})
	
	body.addEventListener("mouseup", terminal.focus.bind(terminal));

	try {
		await shell.process("bootstrap -quiet", false);
		await shell.process(command, printCommand);
	} catch(error) {}
}

try {
	const {command, placeholder} = JSON.parse(decodeURIComponent(location.hash.substring(1)));
	const displayCommand = placeholder ?? command;
	const commands = CommandParser.parse(displayCommand)?.map(item => Format.htmlCommand(displayCommand, item))
		?? [Format.htmlCommand(displayCommand, undefined)];

	const button = DOM.create("button", "start");
	button.textContent = "Click to Run";
	button.onclick = () => init(command, true);

	DOM.clear(root);
	root.append(...commands, button);
} catch(error) {
	init("intro", false);
}