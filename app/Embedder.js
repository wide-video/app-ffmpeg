import * as DOM from "./DOM.js";

export class Embedder {
    constructor(system) {
        this.system = system;
    }

    run(args) {
        const {fileSystem, terminal} = this.system;
        for(const filename of args) {
            const file = fileSystem.get(filename);
            const iframe = DOM.create("iframe");
            iframe.src = URL.createObjectURL(file);
            iframe.onload = () => {
                const style = DOM.create("style");
                style.type = "text/css";
                style.textContent = "img {max-width:100%; height:100%}";
                iframe.contentDocument.body.append(style);
            }
            terminal.write(iframe, "embed");
        }
    }
}