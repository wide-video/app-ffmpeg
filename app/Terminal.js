import * as DOM from "./DOM.js";

export const PROMPT_PREFIX = "$ ";

export class Terminal {
	execute = () => {};

	constructor() {
		const rows = this.rows = DOM.div("rows");

		const input = this.input = DOM.span("input");
		input.contentEditable = true;
		input.onpaste = event => {
			try {
				const text = event.clipboardData.getData("text/plain");
				const selection = window.getSelection();
				if(!selection.rangeCount)
					return;
				selection.deleteFromDocument();
				selection.getRangeAt(0).insertNode(document.createTextNode(text));
				selection.collapseToEnd();
				event.preventDefault();
			} catch(error) {}
		}

		const prompt = this.prompt = DOM.div("prompt");
		prompt.onkeydown = event => {
			if(event.key === "Enter") {
				event.preventDefault();
				this.submit();
			}
		}
		prompt.append(PROMPT_PREFIX, input);

		const container = this.container = DOM.div("Terminal");
		container.append(rows, prompt);

		document.body.addEventListener("click", event => {
			const rows = this.rows;
			const target = event.target;
			if(rows !== target && !rows.contains(target))
				this.focus();
		})
	}

	submit() {
		this.execute(this.input.textContent);
		this.input.textContent = "";
	}

	async process(promise) {
		const classList = this.container.classList;
		classList.add("running");
		try {
			await promise;
		} catch(error) {}
		classList.remove("running");
	}

	focus() {
		this.input.focus();
	}

	write(line, type, replace) {
		const row = DOM.div(type);
		if(line instanceof Element)
			row.append(line);
		else
			row.textContent = line;
		if(replace)
			this.lastRow?.remove();
		
		this.writeRow(row);
		this.lastRow = row;
	}

	writeBlob(blob) {

		const video = DOM.create("video");
		video.src = URL.createObjectURL(blob);
		video.controls = true;

		const row = DOM.div("element");
		row.append(video);
		this.writeRow(row);
	}

	writeRow(row) {
		const body = document.body;
		const isBottom = window.scrollY >= (body.scrollHeight - body.clientHeight - 10);
		this.rows.append(row);
		if(isBottom)
			window.scrollTo(0, body.scrollHeight);
	}
}