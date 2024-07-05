export const NAME = "FFmpeg Online";
export const BASE_URL = location.href;
export const SOURCES_URL = "https://github.com/wide-video/app-ffmpeg/";

export const WIDE_VIDEO = "wide.video";
export const WIDE_VIDEO_URL = "https://wide.video/";

export const FFMPEG = <const>{
	ORIGIN: "https://ffmpeg.org",
	LICENSE: "https://github.com/FFmpeg/FFmpeg/blob/master/COPYING.GPLv3",
	DIR: "ffmpeg-wasm-0.9.1",
	WORKER_ID: "ffmpegWorker",
	FILES: {
		wasm: "ffmpeg-gpl-simd.wasm",
		main: "ffmpeg-gpl-simd-wv.js",
		worker: "ffmpeg-gpl-simd.worker.js"
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