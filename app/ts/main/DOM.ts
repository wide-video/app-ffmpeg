export function create(tagName:string, className?:string) {
	const result = document.createElement(tagName);
	if(className)
		result.className = className;
	return result;
}

export const a = (className?:string) => create("a", className) as HTMLAnchorElement;
export const div = (className?:string) => create("div", className) as HTMLDivElement;
export const iframe = (className?:string) => create("iframe", className) as HTMLIFrameElement;
export const span = (className?:string) => create("span", className) as HTMLSpanElement;
export const style = (className?:string) => create("style", className) as HTMLStyleElement;