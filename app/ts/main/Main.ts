import * as ProgramUtil from "~util/ProgramUtil";
import { Shell } from "~util/Shell";
import { Terminal } from "~util/Terminal";

const body = document.body;
const root = document.getElementById("Terminal")!;
const terminal = new Terminal(root);
const shell = new Shell(terminal);
terminal.focus();
shell.process("help", false);

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