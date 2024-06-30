const FLUSH_SIZE = 1024 * 1024;

export class TTYOutput {
    buffers = [];
	buffersSize = 0;

	constructor(filename, type) {
		this.filename = filename;
		this.type = type;
	}

	push(buffer) {
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
		this.buffers = [];
		this.buffersSize = 0;
		return this.file;
	}
}