import { FFmpegEnv } from "common/type/FFmpegEnv";

export const NAME = "FFmpeg Online";
export const BASE_URL = location.href;
export const SOURCES_URL = "https://github.com/wide-video/app-ffmpeg/";

export const WIDE_VIDEO = "wide.video";
export const WIDE_VIDEO_URL = "https://wide.video/";

export const FFMPEG = <const>{
	ORIGIN: "https://ffmpeg.org",
	LICENSE: "https://github.com/FFmpeg/FFmpeg/blob/master/COPYING.GPLv3",
	DIR: "ffmpeg-wasm-0.9.2",
	WORKER_ID: "ffmpegWorker",
	FILES: {
		wasm: "ffmpeg-gpl-simd.wasm",
		main: "ffmpeg-gpl-simd-wv.js"
	},
	LGPL: <FFmpegEnv>{
		FFMPEG_MAIN_URL: "https://cdn.wide.video/ffmpeg/0.9.2/ffmpeg-lgpl-simd-wv.js",
		FFMPEG_WASM_URL: "https://cdn.wide.video/ffmpeg/0.9.2/ffmpeg-lgpl-simd.wasm"
	}
}

export const ASSET = <const>{
	DIR: "asset",
	FILES: ["concat.txt", "input.jpg", "input.mp4", "logo.png", "script.txt"]
}

export const SOCIAL_MEDIA = <const>{
	Discord: "https://discord.gg/Q54kW97yj5",
	Facebook: "https://www.facebook.com/fb.wide.video",
	Reddit: "https://www.reddit.com/r/widevideo",
	TikTok: "https://www.tiktok.com/@wide.video",
	X: "https://x.com/wide_video",
	YouTube: "https://www.youtube.com/@wide-video"
}