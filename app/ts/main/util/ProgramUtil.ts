import * as ArgsUtil from "~util/ArgsUtil";
import { IShell } from "~type/IShell";
import { System } from "~type/System";

export function addFiles(files:FileList | ReadonlyArray<File> | undefined, system:System, signal:AbortSignal) {
	if(!files?.length) 
		return;

	const {fileSystem, shell, terminal} = system;
	fileSystem.addFiles(files);
	terminal.stdout(`Added ${files.length} files:`);
	ls([...files].map(file => file.name), shell, signal);
}

export const embed = (filenames:ReadonlyArray<string>, shell:IShell, signal:AbortSignal) =>
	shell.subprocess(`embed ${filenameArgs(filenames)}`, signal);

export const fetch = (url:string, filename:string, shell:IShell, signal:AbortSignal) =>
	shell.subprocess(`fetch ${url} ${filename}`, signal);

export const ls = (filenames:ReadonlyArray<string>, shell:IShell, signal:AbortSignal) =>
	shell.subprocess( `ls ${filenameArgs(filenames)}`, signal);

const filenameArgs = (filenames:ReadonlyArray<string>) =>
	filenames.map(filename => ArgsUtil.escape(filename)).join(" ");