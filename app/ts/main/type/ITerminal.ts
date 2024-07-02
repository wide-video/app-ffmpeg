import { History } from "~util/History";
import { TerminalCommand } from "~util/TerminalCommand";

export type ITerminal = {
	readonly prefix:string;
	readonly history:History;
	readonly clear:() => void;
	readonly clearLine:() => void;
	readonly stdout:(line:string | Element) => TerminalCommand;
	readonly stderr:(line:string | Element) => TerminalCommand;
}