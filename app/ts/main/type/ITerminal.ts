import { History } from "~util/History";

export type ITerminal = {
	readonly prefix:string;
	readonly history:History;
	readonly clear:() => void;
	readonly clearLine:() => void;
	readonly stdout:(line:string | Element) => void;
	readonly stderr:(line:string | Element) => void;
}