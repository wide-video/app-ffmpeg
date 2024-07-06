import { NamedBlob } from "common/NamedBlob";

export type FFmpegWorkerIn = {
	readonly args:ReadonlyArray<string>;
	readonly blobs:ReadonlyArray<NamedBlob>;
	readonly ffmpeg:{
		readonly wasm:string;
		readonly main:string;
		readonly worker:string;
	}
}