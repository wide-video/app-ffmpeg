import { ParsedCommand } from "~type/ParsedCommand";

/*
test:
  aFa  "bbb  ccc" 'ddd  eee'  -123	  456 č中文 8 \
 a bb  c
*/
export function parse(command:string):ParsedCommand | undefined {
	let singleQuoteOpen = false;
	let doubleQuoteOpen = false;
	let buffer = "";
	const args = [];
	const length = command.length;
	for(let i = 0; i < length; i++) {
		const token = command[i];
		if(!doubleQuoteOpen && token === "'") {
			singleQuoteOpen = !singleQuoteOpen;
		} else if(!singleQuoteOpen && token === '"') {
			doubleQuoteOpen = !doubleQuoteOpen;
		} else if(!singleQuoteOpen && !doubleQuoteOpen
			&& (token === " " || token === " " || token === "\t" || token === "\n" || token === "\r")) {
			if(buffer.length) {
				args.push(buffer);
				buffer = "";
			}
		} else {
			buffer += token;
		}
	}

	if(buffer.length)
		args.push(buffer);

	if(!args.length)
		return;

	const program = args.shift()!;
	return {args, program};
}