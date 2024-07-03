import * as ArgsUtil from "~util/ArgsUtil";
import * as DOM from "~util/DOM";
import { ParsedCommand } from "~type/ParsedCommand";

export const INDENT = "    ";
export const NL = `
`;

export const NLI = `${NL}${INDENT}`;
export const NLNLI = `${NL}${NLI}`;
export const NLNL = `${NL}${NL}`;

export function htmlCommand(command:string, parsed:ParsedCommand | undefined, prefix?:string) {
	const content:(string | Element)[] = prefix ? [prefix] : [];
	if(parsed) {
		const {args, program} = parsed;
		content.push(DOM.span("program", program));
		for(const arg of args) {
			const element = DOM.span("arg", ArgsUtil.escape(arg));
			if(!isNaN(Number(arg)))
				element.classList.add("number");
			else if(arg.startsWith("-"))
				element.classList.add("modifier");
			content.push(" ", element);
		}
	} else {
		content.push(command);
	}
	return DOM.span("command", content);
}