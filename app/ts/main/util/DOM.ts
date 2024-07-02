export function create(tagName:string, className?:string, content?:Content) {
	const result = document.createElement(tagName);
	append(result, content);
	if(className)
		result.className = className;
	return result;
}

export const a = (className?:string, content?:Content) => create("a", className, content) as HTMLAnchorElement;
export const div = (className?:string, content?:Content) => create("div", className, content) as HTMLDivElement;
export const iframe = (className?:string) => create("iframe", className) as HTMLIFrameElement;
export const input = (className?:string) => create("input", className) as HTMLInputElement;
export const span = (className?:string, content?:Content) => create("span", className, content) as HTMLSpanElement;

export function append(container:Element, content?:Content){
	if(typeof content === "string")
		container.append(content);
	else if(typeof content === "number")
		container.append(`${content}`);
	else if(content instanceof Node)
		container.append(content);
	else if(content instanceof HTMLCollection)
		for(const item of Array.from(content))
			container.append(item);
	else if(Array.isArray(content))
		for(const item of content)
			append(container, item);
}

export const clear = (element:HTMLElement) => element.replaceChildren();

type Content = Node | string | number | undefined | HTMLCollection | ReadonlyArray<Content>;