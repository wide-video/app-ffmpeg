import * as ArgsUtil from "~util/ArgsUtil";
import { Command } from "~type/Command";
import { System } from "~type/System";

export function addFiles(files:FileList | ReadonlyArray<File> | undefined, system:System, signal?:AbortSignal) {
	if(!files?.length) 
		return;

	const {fileSystem, shell, terminal} = system;
	fileSystem.add(files);
	terminal.stdout(`Added ${files.length} files:`);
	const command:Command = `ls ${[...files].map(file => ArgsUtil.escape(file.name)).join(" ")}`;
	if(signal)
		shell.subprocess(command, signal);
	else
		shell.process(command, true);
}