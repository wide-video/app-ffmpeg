export type FFmpegWorkerOut = {
	readonly kind:"error";
	readonly messageOrCode:string | number;
} | {
	readonly kind:"success";
	readonly files:ReadonlyArray<File>;
} | {
	readonly kind:"stderr";
	readonly message:ArrayBuffer;
} | {
	readonly kind:"stdout";
	readonly message:ArrayBuffer;
}