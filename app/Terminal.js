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
		input.onpaste = HTMLUtil.pasteRaw;
		input.oninput = HTMLUtil.scrollToBottom;

		const prompt = this.prompt = DOM.div("prompt");
		prompt.onkeydown = event => {
			switch(event.key) {
				case "ArrowUp":
					if(HTMLUtil.caretAtStart()) {
						event.preventDefault();
						input.textContent = history.move(-1);
						HTMLUtil.scrollToBottom();
					}
					break;
				case "ArrowDown":
					if(HTMLUtil.caretAtEnd()) {
						event.preventDefault();
						input.textContent = history.move(1);
						HTMLUtil.caretToEnd(input);
						HTMLUtil.scrollToBottom();
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
		this.execute(line, true);
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
			HTMLUtil.scrollToBottom();
	}
}