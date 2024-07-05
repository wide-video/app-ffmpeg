import * as AutoComplete from "~util/AutoComplete";
import { Command } from "~type/Command";
import * as DOM from "~util/DOM";
import { FileSystem } from "~util/FileSystem";
import * as Format from "~util/Format";
import { History } from "~util/History";
import * as HTMLUtil from "~util/HTMLUtil";
import { ITerminal } from "~type/ITerminal";
import { PrintedCommand } from "~util/PrintedCommand";
import { TerminalEntryKind } from "~type/TerminalEntryKind";

const KEY_ENTRY_KIND = "entryKind";

export class Terminal implements ITerminal {
	readonly history = new History();
	readonly fileSystem:FileSystem;
	readonly root:HTMLElement;

	private readonly log = DOM.div("log");
	private readonly input = DOM.span("input");
	private readonly prompt = DOM.div("prompt");

	private kill = ():void => {throw "Not Implemented"}
	private execute = (_command:Command):Promise<void> => {throw "Not Implemented"}

	constructor(root:HTMLElement) {
		const {input, log, prompt} = this;

		this.fileSystem = new FileSystem();
		this.root = root;

		HTMLUtil.setContentEditablePlainText(input);
		input.addEventListener("paste", this.onInputPaste.bind(this));
		input.addEventListener("input", this.onInputInput.bind(this));
		input.addEventListener("keydown", this.onInputKeyDown.bind(this));
		prompt.append(DOM.span("prefix", Format.PREFIX), input);
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

	clearLine(kind:TerminalEntryKind) {
		const last = this.log.lastChild;
		if(last instanceof HTMLElement && last.dataset[KEY_ENTRY_KIND] === kind)
			last.remove();
		
	}

	stdout(line:string | Element, kind?:TerminalEntryKind) {
		return this.print(line, "stdout", kind);
	}

	stderr(line:string | Element, kind?:TerminalEntryKind) {
		return this.print(line, "stderr", kind);
	}

	private submit() {
		const {history, input} = this;
		const command = input.textContent as Command;

		if(!command.trim()) {
			this.stdout(Format.PREFIX);
			input.textContent = "";
			return;
		}

		try {
			this.execute(command).catch(() => {});
		} catch(error) {
			return; // another process in progress
		}

		history.add(command);
		input.textContent = "";
	}

	private print(line:string | Element, type:"stdout" | "stderr", kind:TerminalEntryKind | undefined) {
		const body = document.body;
		const isBottom = window.scrollY >= (body.scrollHeight - body.clientHeight - 10);
		const element = DOM.div(type, line);
		DOM.setDataset(element, KEY_ENTRY_KIND, kind);
		this.log.append(element);
		if(isBottom)
			HTMLUtil.scrollToBottom();
		return new PrintedCommand(element);
	}

	private onInputPaste(event:ClipboardEvent) {
		HTMLUtil.pasteRaw(event);
		HTMLUtil.scrollToBottom();
	}

	private onInputInput() {
		HTMLUtil.scrollToBottom();
	}

	private onInputKeyDown(event:KeyboardEvent) {
		const {history, input} = this;
		switch(event.key) {
			case "ArrowUp":
				if(HTMLUtil.caretAtTop(input)) {
					event.preventDefault();
					input.textContent = history.move(-1) ?? "";
					HTMLUtil.caretToEnd(input.lastChild ?? input);
					HTMLUtil.scrollToBottom();
				}
				break;
			case "ArrowDown":
				if(HTMLUtil.caretAtBottom(input)) {
					event.preventDefault();
					input.textContent = history.move(1) ?? "";
					HTMLUtil.caretToEnd(input.lastChild ?? input);
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
				AutoComplete.complete(input, this);
		}
	}

	private onRootMouseUp(event:MouseEvent) {
		event.stopPropagation();
		if(getSelection()?.type === "Caret")
			this.focus();
	}
}