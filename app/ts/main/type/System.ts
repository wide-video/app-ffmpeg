import { FileSystem } from "FileSystem";
import { History } from "History";
import { Terminal } from "Terminal";

export type System = {
	readonly fileSystem:FileSystem;
	readonly history:History;
	readonly terminal:Terminal;
}