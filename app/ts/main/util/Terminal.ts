import * as AutoComplete from "~util/AutoComplete";
import { Command } from "~type/Command";
import * as DOM from "~util/DOM";
import { FileSystem } from "~util/FileSystem";
import { History } from "~util/History";
import * as HTMLUtil from "~util/HTMLUtil";
import { ITerminal } from "~type/ITerminal";

export class Terminal implements ITerminal {
	readonly prefix = "> ";
	readonly history = new History();
	readonly fileSystem:FileSystem;
	readonly root:HTMLElement;

	private readonly log = DOM.div("log");
	private readonly input = DOM.span("input");
	private readonly prompt = DOM.div("prompt");

	private kill = ():void => {throw "Not Implemented"}
	private execute = (_command:Command):Promise<void> => {throw "Not Implemented"}

	constructor(root:HTMLElement) {
		const {input, log, prefix, prompt} = this;

		this.fileSystem = new FileSystem();
		this.root = root;

		input.contentEditable = "true";
		input.addEventListener("paste", this.onInputPaste.bind(this));
		input.addEventListener("input", this.onInputInput.bind(this));
		input.addEventListener("keydown", this.onInputKeyDown.bind(this));
		prompt.append(prefix, input);
		DOM.clear(root);
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
		DOM.clear(this.log);
	}

	clearLine() {
		this.log.lastChild?.remove();
	}

	stdout(line:string | Element) {
		this.print(line, "stdout");
	}

	stderr(line:string | Element) {
		this.print(line, "stderr");
	}

	private submit() {
		const {history, input} = this;
		const command = input.textContent as Command;
		if(!command)
			return;
		
		try {
			this.execute(command).catch(() => {});
		} catch(error) {
			return; // another process in progress
		}

		history.add(command);
		input.textContent = "";
	}

	private print(line:string | Element, type:"stdout" | "stderr") {
		const body = document.body;
		const isBottom = window.scrollY >= (body.scrollHeight - body.clientHeight - 10);
		this.log.append(DOM.div(type, line));
		if(isBottom)
			HTMLUtil.scrollToBottom();
	}

	private onInputPaste(event:ClipboardEvent) {
		HTMLUtil.pasteRaw(event);
		HTMLUtil.scrollToBottom();
	}

	private onInputInput() {
		HTMLUtil.scrollToBottom();
	}

	private onInputKeyDown(event:KeyboardEvent) {
		const {fileSystem, history, input} = this;
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
			case "Tab":
				event.preventDefault();
				AutoComplete.complete(input, fileSystem);
		}
	}

	private onRootMouseUp(event:MouseEvent) {
		event.stopPropagation();
		if(getSelection()?.type === "Caret")
			this.focus();
	}
}