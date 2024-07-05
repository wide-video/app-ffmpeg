import { History } from "~util/History";
import { PrintedCommand } from "~util/PrintedCommand";
import { TerminalEntryKind } from "~type/TerminalEntryKind";

export type ITerminal = {
	readonly history:History;
	readonly clear:() => void;
	readonly clearLine:(kind:TerminalEntryKind) => void;
	readonly stdout:(line:string | Element, kind?:TerminalEntryKind) => PrintedCommand;
	readonly stderr:(line:string | Element, kind?:TerminalEntryKind) => PrintedCommand;
}