import * as FFmpeg from "./FFmpeg.js";

export class Shell {
    system;

    constructor(system) {
        this.system = system;
    }

    async run(command, args) {
        const system = this.system;
        const {fileSystem, terminal} = system;
        switch(command) {
            case "ffmpeg": return await FFmpeg.run(args, system);
            case "help": return this.runHelp(args);
            case "ls": return fileSystem.run(args);
            default: terminal.write(`command not found: ${command}`, "stderr");
        }
    }

    runHelp() {
        this.system.terminal.write("this is help", "stdout");
    }
}
