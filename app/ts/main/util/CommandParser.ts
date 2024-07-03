import { ParsedCommand } from "~type/ParsedCommand";

/*
test:
  aFa  "bbb  ccc" 'ddd  eee'  -123	  456 č中文 8 \
 a bb  c
*/
export function parse(command:string):ParsedCommand[] | undefined {
	const result:ParsedCommand[] = [];
	const length = command.length;
	let i = 0
	while(i < length) {
		let quote:"'" | '"' | undefined;
		let escaped = false;
		let buffer = "";
		const args = [];
		while(i < length) {
			const token = command[i++]!;
			if(escaped) {
				if(token !== "\r" && token !== "\n")
					buffer += token;
				if(token === "\r" && command[i] === "\n")
					i++;
				escaped = false;
			} else if(token === "\\") {
				escaped = true;
			} else if(quote && token === quote) {
				quote = undefined;
				args.push(buffer);
				buffer = "";
			} else if(quote) {
				buffer += token;
			} else if(token === "'" || token === '"') {
				quote = token;
			} else if(token === " " || token === " " || token === "\t") {
				if(buffer.length) {
					args.push(buffer);
					buffer = "";
				}
			} else if(token === "\n" || token === "\r") {
				break;
			} else {
				buffer += token;
			}
		}

		if(quote || escaped)
			return;

		if(buffer.length)
			args.push(buffer);

		if(!args.length)
			continue;

		const program = args.shift()!;
		result.push({args, program});
	}

	return result.length ? result : undefined;
}