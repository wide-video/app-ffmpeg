export class FileSystem {
    terminal;
    map = {};

    constructor(terminal) {
        this.terminal = terminal;
    }

    get list() {
        return Object.values(this.map).sort((a, b) => a.name.localeCompare(b.name));
    }

    add(files) {
        for(const file of files)
            this.map[file.name] = file;
        this.terminal.execute("ls");
    }

    run() {
        for(const file of this.list) {
            const line = `${file.size}`.padStart(9) + ` ${file.name}`;
            this.terminal.write(line, "stdout");
        }
    }
}