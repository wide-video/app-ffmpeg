import { FileSystem } from "./FileSystem.js"
import { History } from "./History.js"
import { Shell } from "./Shell.js"
import { Terminal } from "./Terminal.js"

const body = document.body;

const history = new History();
const terminal = new Terminal(history);
const fileSystem = new FileSystem(terminal);
const shell = new Shell({fileSystem, history, terminal});

body.append(terminal.container);
terminal.focus();
terminal.execute = shell.run.bind(shell);

body.ondrop = event => {
	event.preventDefault();
    body.classList.remove("dragOver");
    const files = event.dataTransfer.files;
    fileSystem.add(files);
    terminal.stdout(`Added ${files.length} files:`);
    terminal.execute(`ls ${[...files].map(file => file.name).join(" ")}`, false);
}

body.ondragleave = event => {
    if(body === event.target)
        body.classList.remove("dragOver"); 
}

body.ondragover = event => {
    event.preventDefault();
    body.classList.add("dragOver");
}