import { Command } from "~type/Command";
import * as DOM from "~util/DOM";
import { History } from "~util/History";
import * as HTMLUtil from "~util/HTMLUtil";

export const PROMPT_PREFIX = "$ ";

export const COMMAND_CLEAR = "clear";

export class Terminal {
	private readonly history:History;
	private readonly rows = DOM.div("rows");
	private readonly input = DOM.span("input");
	private readonly prompt = DOM.div("prompt");
	readonly container = DOM.div("Terminal");

	constructor(history:History) {
		this.history = history;
		const {container, input, prompt, rows} = this;

		input.contentEditable = "true";
		input.onpaste = HTMLUtil.pasteRaw;
		input.oninput = HTMLUtil.scrollToBottom;

		prompt.onkeydown = event => {
			switch(event.key) {
				case "ArrowUp":
					if(HTMLUtil.caretAtStart()) {
						event.preventDefault();
						input.textContent = history.move(-1) ?? "";
						HTMLUtil.scrollToBottom();
					}
					break;
				case "ArrowDown":
					if(HTMLUtil.caretAtEnd()) {
						event.preventDefault();
						input.textContent = history.move(1) ?? "";
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
		container.append(rows, prompt);

		document.body.addEventListener("click", event => {
			const rows = this.rows;
			const target = event.target;
			if(target instanceof Node && rows !== target && !rows.contains(target))
				this.focus();
		})
	}

	execute (_command:Command, _printPrompt?:boolean):Promise<any> {
		throw "Not implemented;"
	}

	submit() {
		const {history, input} = this;
		const line = input.textContent;
		if(!line)
			return;
		history.add(line);
		this.execute(<Command>line, true);
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

	stdout(line:string | Element) {
		this.write(line, "stdout");
	}

	stderr(line:string | Element) {
		this.write(line, "stderr");
	}

	private write(line:string | Element, type:string) {
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