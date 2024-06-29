import * as ContentType from "./ContentType.js"

const post = (message, options) => self.postMessage(message, options);

self.onmessage = async (event) => {
    const {args, wasmUrl, ffmpegUrl, ffmpegWorkerUrl, files} = event.data;

    // Worker is module so `importScripts(ffmpegUrl)` is not available...
    // but this little hack makes createFFmpeg available instead importScripts
    self.define = (_, c) => self.createFFmpeg = c();
    self.define.amd = true;
    await import(ffmpegUrl);
    delete self.define;

    const module = await createFFmpeg({
        stderr:(buffer, offset, length) => {
            if(!length) return;
            const message = buffer.slice(offset, offset + length).buffer;
            post({kind:"stderr", message}, {transfer:[message]});
        },
        stdout:(buffer, offset, length) => {
            if(!length) return;
            const message = buffer.slice(offset, offset + length).buffer;
            post({kind:"stdout", message}, {transfer:[message]});
        },
        printErr:console.log,
        locateFile:url => {
            if(url.endsWith(".wasm")) return wasmUrl;
            if(url.endsWith(".worker.js")) return ffmpegWorkerUrl;
            return url;},
        mainScriptUrlOrBlob:ffmpegUrl});

    const FS = module.FS;

    // mount all blobs and symlink each to root
    const WORKERFS = "workerfs"
    FS.mkdir(WORKERFS);
    FS.mount(module.WORKERFS, {files}, WORKERFS);
    for(const filename of FS.readdir(`/${WORKERFS}`))
        if(filename !== "." && filename !== "..")
            FS.symlink(`/${WORKERFS}/${filename}`, `/${filename}`);

    // store the original content
    const dirContent = FS.readdir("/");

    module.onExit = () => {
        const files = [];
        for(const filename of FS.readdir("/"))
            if(!dirContent.includes(filename)) {
                // report all new files
                const content = FS.readFile(filename);
                const type = ContentType.getMimeType(filename);
                const options = type ? {type} : undefined;
                files.push(new File([content.buffer], filename, options));
            }
        self.postMessage({kind:"onExit", files});
    }
    module.callMain(args);
};