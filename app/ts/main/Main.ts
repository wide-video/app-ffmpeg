import { Shell } from "~util/Shell"
import { Terminal } from "~util/Terminal"

const body = document.body;
const terminal = new Terminal();
const shell = new Shell(terminal);

body.append(terminal.container);
terminal.focus();

body.addEventListener("drop", event => {
	event.preventDefault();
	body.classList.remove("dragOver");
	const files = event.dataTransfer?.files;
	if(files?.length) {
		shell.system.fileSystem.add(files);
		terminal.stdout(`Added ${files.length} files:`);
		shell.process(`ls ${[...files].map(file => file.name).join(" ")}`, new AbortController(), false);
	}
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