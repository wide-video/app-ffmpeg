export const MAP = {
	"apng": "image/apng",
	"avif": "image/avif",
	"bmp": "image/bmp",
	"gif": "image/gif",
	"js": "text/javascript",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"mkv": "video/x-matroska",
	"mp3": "audio/mpeg",
	"mp4": "video/mp4",
	"ogg": "video/ogg",
	"png": "image/png",
	"svg": "image/svg+xml",
	"wasm": "application/wasm",
	"wav": "audio/wav",
	"webm": "video/webm",
	"webp": "image/webp",
} as const;

export function getMimeType(path:string):string | undefined {
	const index = path.lastIndexOf(".");
	return index !== -1
		? (MAP as Record<string, string>)[path.substring(index + 1).toLowerCase()]
		: undefined;
}