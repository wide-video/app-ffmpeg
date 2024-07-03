import { History } from "~util/History";
import { PrintedCommand } from "~util/PrintedCommand";

export type ITerminal = {
	readonly prefix:string;
	readonly history:History;
	readonly clear:() => void;
	readonly clearLine:() => void;
	readonly stdout:(line:string | Element) => PrintedCommand;
	readonly stderr:(line:string | Element) => PrintedCommand;
}