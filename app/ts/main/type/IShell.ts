import { Program } from "~program/Program";
import { Command } from "./Command";

export type IShell = {
	readonly programs:ReadonlyArray<Program>;

	print:(command:Command) => void;
	process:(command:Command, printCommand?:boolean) => Promise<void>;
	subprocess:(command:Command, signal:AbortSignal) => Promise<void>;
}