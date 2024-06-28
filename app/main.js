import * as CommandParser from "./CommandParser.js"
import * as DOM from "./DOM.js";
import { FileSystem } from "./FileSystem.js"
import { Shell } from "./Shell.js"
import { Terminal, PROMPT_PREFIX } from "./Terminal.js"

const body = document.body;

const terminal = new Terminal();
const fileSystem = new FileSystem(terminal);
const system = {terminal, fileSystem};
const shell = new Shell(system);

body.append(terminal.container);
terminal.focus();
terminal.execute = line => {
    const parsed = CommandParser.parse(line);
    if(!parsed)
        return terminal.write(`${PROMPT_PREFIX}${line}`, "prompt");

    const {command, args} = parsed;
    const commandElement = DOM.span("command");
    commandElement.textContent = command;

    const lineElement = DOM.span();
    lineElement.append(PROMPT_PREFIX, commandElement);
    for(const arg of args) {
        const element = DOM.span("arg");
        if(arg.startsWith("-"))
            element.classList.add("modifier");
        if(!isNaN(Number(arg)))
            element.classList.add("number");
        element.textContent = arg;
        lineElement.append(" ", element);
    };
    terminal.write(lineElement, "prompt");
    terminal.process(shell.run(command, args));
}

body.ondrop = event => {
	event.preventDefault();
    fileSystem.add(event.dataTransfer.files);
}

body.ondragover = event => event.preventDefault();