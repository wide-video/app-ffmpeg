export function toBlob(source:Blob, type?:string):Blob {
	return new Blob([source], type ? {type} : undefined);
}

const urlMap = new WeakMap<Blob, string>();
const urlRevoker = new FinalizationRegistry((url:string) => URL.revokeObjectURL(url));
export function url(source:Blob):string {
	const mapped = urlMap.get(source);
	if(mapped)
		return mapped;
	const url = URL.createObjectURL(source);
	urlMap.set(source, url);
	urlRevoker.register(source, url);
	return url;
}