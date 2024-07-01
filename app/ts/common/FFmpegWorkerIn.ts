export type FFmpegWorkerIn = {
	readonly args:ReadonlyArray<string>;
	readonly files:ReadonlyArray<File>;
}