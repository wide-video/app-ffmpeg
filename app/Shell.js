import * as CommandParser from "./CommandParser.js"
import * as DOM from "./DOM.js";
import { Embedder } from "./Embedder.js";
import { FFmpeg } from "./FFmpeg.js";
import { Open } from "./Open.js";
import { PROMPT_PREFIX } from "./Terminal.js";
import { Save } from "./Save.js";

export class Shell {
    constructor(system) {
        this.system = system;
        this.embedder = new Embedder(system);
        this.ffmpeg = new FFmpeg(system);
        this.open = new Open(system);
        this.save = new Save(system);
    }

    async run(line, printPrompt) {
        const {embedder, ffmpeg, open, save, system} = this;
        const {fileSystem, terminal} = system;
        const parsed = CommandParser.parse(line);
        if(printPrompt)
                this.printLine(line, parsed, PROMPT_PREFIX);

        const {command, args} = parsed;

        try {
            switch(command.toLowerCase()) {
                case "clear": return terminal.clear();
                case "embed": return embedder.run(args);
                case "ffmpeg": return await ffmpeg.run(args);
                case "help": return this.runHelp(args);
                case "history": return this.runHistory(args);
                case "ls": return await fileSystem.run(args);
                case "open": return await open.run(args);
                case "save": return await save.run(args);
            }
            throw `command not found: ${command}`;
        } catch(error) {
            terminal.stderr(`${error}`);
        }
    }

    runHelp() {
        this.system.terminal.stdout("this is help");
    }

    runHistory() {
        for(const line of this.system.history.getList())
            this.printLine(line, CommandParser.parse(line));
    }

    printLine(line, parsed, prefix="") {
        const terminal = this.system.terminal;
        if(!parsed)
            return terminal.stdout(`${prefix}${line}`);

        const {args, command} = parsed;
        const commandElement = DOM.span("command");
        commandElement.textContent = command;
    
        const lineElement = DOM.span("prompt");
        lineElement.append(prefix, commandElement);
        for(const arg of args) {
            const element = DOM.span("arg");
            if(!isNaN(Number(arg)))
                element.classList.add("number");
            else if(arg.startsWith("-"))
                element.classList.add("modifier");
            element.textContent = arg;
            lineElement.append(" ", element);
        };
        terminal.stdout(lineElement);
    }
}
