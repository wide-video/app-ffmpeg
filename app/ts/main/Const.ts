export const FFMPEG = <const>{
	DIR: "ffmpeg-wasm-0.9.1",
	FILES: {
		wasm: "ffmpeg-gpl-simd.wasm",
		main: "ffmpeg-gpl-simd-wv.js",
		worker: "ffmpeg-gpl-simd.worker.js"
	}
}

export const ASSET = <const>{
	DIR: "asset",
	FILES: ["concat.txt", "input.jpg", "input.mp4"]
}

export const BASE_URL = location.href;
export const WIDE_VIDEO_URL = "https://wide.video/";