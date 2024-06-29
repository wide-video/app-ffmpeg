import * as DOM from "./DOM.js";

export class Save {
    constructor(system) {
        this.system = system;
    }

    async run(args) {
        const {fileSystem} = this.system;
        for(const filename of args) {
            const file = fileSystem.get(filename);
            if(showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({suggestedName:filename});
                const writable = await handle.createWritable();
                await writable.write(file);
                await writable.close();
            } else {
                const a = DOM.create("a");
                a.download = filename;
                a.href = URL.createObjectURL(file);
                a.click();
            }
        }
    }
}