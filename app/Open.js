export class Open {
    constructor(system) {
        this.system = system;
    }

    async run(args) {
        const {fileSystem} = this.system;
        for(const filename of args) {
            const file = fileSystem.get(filename);
            open(URL.createObjectURL(file), "_blank");
        }
    }
}