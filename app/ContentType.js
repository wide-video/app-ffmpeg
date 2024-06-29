const MAP = {
    "apng": "image/apng",
    "avif": "image/avif",
	"bmp": "image/bmp",
    "gif": "image/gif",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "mkv": "video/x-matroska",
	"mp3": "audio/mpeg",
    "mp4": "video/mp4",
    "ogg": "video/ogg",
    "png": "image/png",
    "svg": "image/svg+xml",
	"wav": "audio/wav",
	"webm": "audio/webm",
    "webp": "image/webp",
}

export function getMimeType(path) {
    const index = path.lastIndexOf(".");
    return index !== -1
        ? MAP[path.substring(index+1).toLowerCase()]
        : undefined;
}