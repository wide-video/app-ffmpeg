import { Program } from "~program/Program";
import { Command } from "./Command";

export type IShell = {
	readonly programs:ReadonlyArray<Program>;

	getProgram:(name:string) => Program | undefined;
	subprocess:(command:Command, signal:AbortSignal) => Promise<void>;
}