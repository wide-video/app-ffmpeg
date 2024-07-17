import { Env } from "~type/Env";
import { FileSystem } from "~util/FileSystem";
import { IShell } from "~type/IShell";
import { ITerminal } from "~type/ITerminal";

export type System = {
	readonly env:Env;
	readonly fileSystem:FileSystem;
	readonly shell:IShell;
	readonly terminal:ITerminal;
}