import { FileSystem } from "~util/FileSystem";
import { History } from "~util/History";
import { Terminal } from "~util/Terminal";

export type System = {
	readonly fileSystem:FileSystem;
	readonly history:History;
	readonly terminal:Terminal;
}