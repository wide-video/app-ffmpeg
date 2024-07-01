const FLUSH_SIZE = 1024 * 1024;

export class TTYOutput {
	private readonly filename:string;
	private readonly type:string | undefined;
	private readonly buffers:ArrayBuffer[] = [];
	private buffersSize = 0;
	private file?:File;

	constructor(filename:string, type?:string) {
		this.filename = filename;
		this.type = type;
	}

	push(buffer:ArrayBuffer) {
		this.buffers.push(buffer);
		this.buffersSize += buffer.byteLength; // +32 KB
		if(this.buffersSize >= FLUSH_SIZE)
			this.flush();
	}

	flush() {
		const {buffers, buffersSize, file, filename, type} = this;
		if(!buffersSize)
			return file;

		this.file = new File(file ? [file, ...buffers] : buffers, filename, type ? {type} : undefined);
		this.buffers.length = 0;
		this.buffersSize = 0;
		return this.file;
	}
}