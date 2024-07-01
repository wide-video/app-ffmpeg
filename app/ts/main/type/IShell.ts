import { Command } from "./Command";

export type IShell = {
	subprocess:(command:Command, signal:AbortSignal) => Promise<void>;
}