declare global {
	const createFFmpeg:EmscriptenModuleFactory<FFmpegModule>;

	interface FFmpegModule extends EmscriptenModule {
		readonly FS:(typeof FS) & {
			mknod(path: string, mode?: number, dev?: number): any;
		};
	
		readonly mainScriptUrlOrBlob:Blob | string;
		readonly wasmMemory?:WebAssembly.Memory;
		readonly WORKERFS:Emscripten.FileSystemType;
		readonly ___wasm_init_memory_flag:number;
	
		// customized:
		readonly stdin:(length:number) => Int8Array | undefined;
		readonly stdout:(buffer:Int8Array, offset:number, length:number) => any;
		readonly stderr:(buffer:Int8Array, offset:number, length:number) => any;
		readonly tty:(stream:FS.FSStream & FS.Lookup, buffer:Int8Array, offset:number, length:number ,pos:number) => boolean;
	
		readonly callMain:(args:ReadonlyArray<string>) => number;
		onExit:() => void;
	}
}

export {}