import { FFmpegEnv } from "common/type/FFmpegEnv";

export const NAME = "FFmpeg Online";
export const BASE_URL = location.href;
export const SOURCES_URL = "https://github.com/wide-video/app-ffmpeg/";

export const WIDE_VIDEO = "wide.video";
export const WIDE_VIDEO_URL = "https://wide.video/";

const FFMPEG_VERSION = "0.11.2";
export const FFMPEG = {
	ORIGIN: "https://ffmpeg.org",
	LICENSE: "https://github.com/FFmpeg/FFmpeg/blob/master/COPYING.GPLv3",
	DIR: `ffmpeg-wasm-${FFMPEG_VERSION}`,
	WORKER_ID: "ffmpegWorker",
	FILES: {
		wasm: "ffmpeg-gpl.wasm",
		main: "ffmpeg-gpl-wv.js"
	},
	LGPL: {
		FFMPEG_MAIN_URL: "https://cdn.wide.video/ffmpeg/${FFMPEG_VERSION}/ffmpeg-lgpl-wv.js",
		FFMPEG_WASM_URL: "https://cdn.wide.video/ffmpeg/${FFMPEG_VERSION}/ffmpeg-lgpl.wasm"
	} as FFmpegEnv
} as const

export const ASSET = {
	DIR: "asset",
	FILES: ["concat.txt", "input.jpg", "input.mp4", "logo.png", "script.txt"]
} as const

export const SOCIAL_MEDIA = {
	Discord: "https://discord.gg/Q54kW97yj5",
	Facebook: "https://www.facebook.com/fb.wide.video",
	Reddit: "https://www.reddit.com/r/widevideo",
	TikTok: "https://www.tiktok.com/@wide.video",
	X: "https://x.com/wide_video",
	YouTube: "https://www.youtube.com/@wide-video"
} as const