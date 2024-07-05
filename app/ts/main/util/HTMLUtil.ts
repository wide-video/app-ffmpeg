// not supportedd by Firefox
const PLAINTEXT_ONLY = "plaintext-only";

export function caretAtTop(element:Element) {
	const selection = getSelection();
	if(!selection)
		return false;
	try {
		const rects1 = selection.getRangeAt(0).getClientRects();
		if(rects1.length) {
			const y1 = [...rects1].reduce((p, c) => Math.max(p, c.y), Number.MIN_VALUE);
			const rects2 = element.getClientRects()!;
			const y2 = [...rects2].reduce((p, c) => Math.min(p, c.y), Number.MAX_VALUE);
			return y1 === y2;
		}
	} catch(error) {}
	return !selection.anchorOffset;
}

export function caretAtBottom(element:Element) {
	const selection = getSelection();
	if(!selection)
		return false;
	try {
		const rects1 = selection.getRangeAt(0).getClientRects();
		if(rects1.length) {
			const y1 = [...rects1].reduce((p, c) => Math.min(p, c.y), Number.MAX_VALUE);
			const rects2 = element.getClientRects()!;
			const y2 = [...rects2].reduce((p, c) => Math.max(p, c.y), Number.MIN_VALUE);
			return y1 === y2;
		}
	} catch(error) {}
	return selection.anchorOffset === (selection.anchorNode?.textContent?.length ?? 0);
}

export function caretToEnd(node:Node) {
	const range = document.createRange();
	range.selectNodeContents(node);
	range.collapse();
	
	const selection = getSelection();
	selection?.removeAllRanges();
	selection?.addRange(range);
}

export function caretToPosition(node:Node, position:number) {
	try {
		const range = document.createRange();
		range.setEnd(node.childNodes[0]!, position);
		range.collapse();
		
		const selection = getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	} catch(error) {}
}

export function setContentEditablePlainText(element:HTMLElement) {
	try {
		element.contentEditable = PLAINTEXT_ONLY;
	} catch(error) {
		element.contentEditable = "true";
	}
}

export function pasteRaw(event:ClipboardEvent) {
	try {
		const {clipboardData, target} = event;
		if(target instanceof HTMLElement && target.contentEditable === PLAINTEXT_ONLY)
			return;
		if(!clipboardData)
			return;
		const text = clipboardData.getData("text/plain");
		const selection = getSelection();
		if(!selection?.rangeCount)
			return;
		selection.deleteFromDocument();
		selection.getRangeAt(0).insertNode(document.createTextNode(text));
		selection.collapseToEnd();
		event.preventDefault();
	} catch(error) {}
}

export function scrollToBottom() {
	scrollTo(0, document.body.scrollHeight);
}