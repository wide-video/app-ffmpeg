import { FFmpegEnv } from "common/type/FFmpegEnv";
import { NamedBlob } from "common/type/NamedBlob";

export type FFmpegWorkerIn = {
	readonly args:ReadonlyArray<string>;
	readonly blobs:ReadonlyArray<NamedBlob>;
	readonly env:FFmpegEnv;
}