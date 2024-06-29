import * as DOM from "./DOM.js";
import * as HTMLUtil from "./HTMLUtil.js";

export const PROMPT_PREFIX = "$ ";

export class Terminal {
	execute = () => {};

	constructor(history) {
		this.history = history;

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
			switch(event.key) {
				case "ArrowUp":
					if(!getSelection().anchorOffset) {
						event.preventDefault();
						input.textContent = history.get(-1);
					}
					break;
				case "ArrowDown":
					if(getSelection().anchorOffset === input.innerHTML.length) {
						event.preventDefault();
						input.textContent = history.get(1);
						HTMLUtil.caretToEnd(input);
					}
					break;
				case "Enter":
					event.preventDefault();
					this.submit();
					break;
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
		const {history, input} = this;
		const line = input.textContent;
		history.add(line);
		this.execute(line);
		input.textContent = "";
	}

	focus() {
		this.input.focus();
	}

	clear() {
		this.rows.replaceChildren();
	}

	clearLine() {
		this.rows.lastChild?.remove();
	}

	stdout(line) {
		this.write(line, "stdout");
	}

	stderr(line) {
		this.write(line, "stderr");
	}

	write(line, type) {
		const row = DOM.div(type);
		if(line instanceof Element)
			row.append(line);
		else
			row.textContent = line;
		
		const body = document.body;
		const isBottom = window.scrollY >= (body.scrollHeight - body.clientHeight - 10);
		this.rows.append(row);
		if(isBottom)
			window.scrollTo(0, body.scrollHeight);
	}
}