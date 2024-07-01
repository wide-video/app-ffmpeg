import { Command } from "~type/Command";
import * as DOM from "~util/DOM";
import { History } from "~util/History";
import * as HTMLUtil from "~util/HTMLUtil";
import { ITerminal } from "~type/ITerminal";

export const PROMPT_PREFIX = "$ ";
export const COMMAND_CLEAR = "clear";

export class Terminal implements ITerminal {
	readonly history = new History();
	readonly root = DOM.div("Terminal");

	private readonly log = DOM.div("log");
	private readonly input = DOM.span("input");
	private readonly prompt = DOM.div("prompt");

	private kill = ():void => {throw "Not Implemented"}
	private execute = (_command:Command, _controller:AbortController, _printPrompt?:boolean):Promise<void> => {throw "Not Implemented"}

	constructor() {
		const {input, log, prompt, root} = this;

		input.contentEditable = "true";
		input.addEventListener("paste", HTMLUtil.pasteRaw);
		input.addEventListener("input", HTMLUtil.scrollToBottom);
		input.addEventListener("keydown", this.onInputKeyDown.bind(this));
		prompt.append(PROMPT_PREFIX, input);
		root.append(log, prompt);
		root.addEventListener("mouseup", this.onRootMouseUp.bind(this));
	}

	init(execute:typeof this.execute, kill:typeof this.kill) {
		this.execute = execute;
		this.kill = kill;
	}

	focus() {
		this.input.focus();
	}

	clear() {
		this.log.replaceChildren();
	}

	clearLine() {
		this.log.lastChild?.remove();
	}

	stdout(line:string | Element) {
		this.write(line, "stdout");
	}

	stderr(line:string | Element) {
		this.write(line, "stderr");
	}

	private submit() {
		const {history, input} = this;
		const line = input.textContent;
		if(!line)
			return;
		history.add(line);
		this.execute(<Command>line, new AbortController(), true).catch(() => {});
		input.textContent = "";
	}

	private write(line:string | Element, type:"stdout" | "stderr") {
		const row = DOM.div(type);
		if(line instanceof Element)
			row.append(line);
		else
			row.textContent = line;
		
		const body = document.body;
		const isBottom = window.scrollY >= (body.scrollHeight - body.clientHeight - 10);
		this.log.append(row);
		if(isBottom)
			HTMLUtil.scrollToBottom();
	}

	private onInputKeyDown(event:KeyboardEvent) {
		const {history, input} = this;
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
			case "c":
				if(event.ctrlKey)
					this.kill();
				break;
			case "Enter":
				event.preventDefault();
				this.submit();
				break;
		}
	}

	private onRootMouseUp(event:MouseEvent) {
		event.stopPropagation();
		if(getSelection()?.type === "Caret")
			this.focus();
	}
}