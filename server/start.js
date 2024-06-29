const https = require("https");
const { URL } = require("url");
const fs = require("fs");
const path = require("path");

process.chdir("./app");
const cwd = process.cwd();

const protocol = "https:";
const mainOptions = {
	key: fs.readFileSync(__dirname + "/ffmpeg.wv.key"),
	cert: fs.readFileSync(__dirname + "/ffmpeg.wv.crt")
}

const isFile = (cwd, pathname) => fs.existsSync(cwd + pathname) && fs.statSync(cwd + pathname).isFile();
const getPathname = url => decodeURI(new URL("https://localhost" + url).pathname);
const addContentType = (response, ext) => {
	const map = {
		".css": "text/css",
		".html": "text/html",
		".js": "text/javascript",
		".wasm": "application/wasm"};
	response.setHeader("Content-type", map[ext] || "text/plain");
}
const addCOHeaders = response => {
	response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
}

const mainApp = (request, response) => {
	const resolveResponse = url => {
		if(url === "/")
			return {pathname:"/index.html"};
	
		const pathname = getPathname(url);
		if(isFile(cwd, pathname))
			return {pathname};

		if(isFile(cwd, `${pathname}.br`))
			return {pathname, archive:"br"};
	
		return {pathname};
	}

	const {url} = request;
	const {pathname, archive} = resolveResponse(url);

	fs.readFile(`${cwd}${pathname}${archive ? "." + archive : ""}`, (err, data) => {
		if(err){
			response.statusCode = 500;
			response.end(`Error getting the file: ${err}.`);
		} else {
			addCOHeaders(response);
			addContentType(response, path.parse(pathname).ext);
			
			if(archive) {
				response.setHeader("Content-Encoding", archive);
				response.setHeader("Vary", "Accept-Encoding");
			}

			response.end(data);
		}
	});
}

const app = (request, response) => {
	const {headers:{host}, method, url} = request;
	console.log(`${method} ${protocol}//${host}${url}`);
	mainApp(request, response);
}

const server = https.createServer(mainOptions, app);
server.listen(443);
console.log(`Servers started on ${protocol}//ffmpeg.wv`);