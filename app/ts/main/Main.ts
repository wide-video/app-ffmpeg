import * as ProcessUtil from "~util/ProcessUtil";
import { Shell } from "~util/Shell";
import { Terminal } from "~util/Terminal";

const body = document.body;
const terminal = new Terminal();
const shell = new Shell(terminal);

body.append(terminal.root);
terminal.focus();
shell.process("help", false);

body.addEventListener("drop", event => {
	event.preventDefault();
	body.classList.remove("dragOver");
	ProcessUtil.addFiles(event.dataTransfer?.files, shell.system);
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