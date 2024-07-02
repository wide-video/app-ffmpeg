const urlMap = new WeakMap<Blob, string>();

export function url(blob:Blob) {
	const cached = urlMap.get(blob);
	if(cached)
		return cached;
	const url = URL.createObjectURL(blob);
	urlMap.set(blob, url);
	return url;
}