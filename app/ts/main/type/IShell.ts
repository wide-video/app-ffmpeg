import { Command } from "./Command";

export type IShell = {
	subprocess:(line:Command, signal:AbortSignal) => Promise<void>;
}