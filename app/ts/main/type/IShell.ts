import { Command } from "./Command";

export type IShell = {
	print:(command:Command) => void;
	subprocess:(command:Command, signal:AbortSignal) => Promise<void>;
}