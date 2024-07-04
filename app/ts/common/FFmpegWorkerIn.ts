export type FFmpegWorkerIn = {
	readonly args:ReadonlyArray<string>;
	readonly files:ReadonlyArray<File>;
	readonly ffmpeg:{
		readonly wasm:string;
		readonly main:string;
		readonly worker:string;
	}
}