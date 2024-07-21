const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

const root = `${process.cwd()}/dist`;
const protocol = "https:";
const origin = `${protocol}//ffmpeg.wv`;
const contentType = {
	".css": "text/css",
	".html": "text/html",
	".js": "text/javascript",
	".wasm": "application/wasm"};

function isFile(pathname) {
	const path = `${root}/${pathname}`;
	return fs.existsSync(path) && fs.statSync(path).isFile();
}

function resolveResponse(path) {
	if(!path || path === "/") return {pathname:"/index.html"};

	const pathname = decodeURI(new URL(`${origin}${path}`).pathname);
	if(isFile(pathname)) return {pathname};
	if(isFile(`${pathname}.br`)) return {pathname, archive:"br"};
	return {pathname};
}

function server(request, response) {
	const {headers:{host}, method, url} = request;
	console.log(`${method} ${protocol}//${host}${url}`);

	const {pathname, archive} = resolveResponse(request.url);
	try {
		const data = fs.readFileSync(`${root}${pathname}${archive ? "." + archive : ""}`);
		response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
		response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
		response.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // allow running in an <iframe>
		response.setHeader("Content-type", contentType[path.parse(pathname).ext] || "text/plain");
		if(archive) {
			response.setHeader("Content-Encoding", archive);
			response.setHeader("Vary", "Accept-Encoding");
		}
		response.end(data);
	} catch(error) {
		response.statusCode = 500;
		response.end(`Error getting the file: ${error}.`);
	}
}

https.createServer({
	key: fs.readFileSync(__dirname + "/ffmpeg.wv.key"),
	cert: fs.readFileSync(__dirname + "/ffmpeg.wv.crt")}, server).listen(443);
console.log(`Servers started on ${origin}`);