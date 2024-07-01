export function caretAtStart() {
	const selection = getSelection();
	return selection ? !selection.anchorOffset : false;
}

export function caretAtEnd() {
	const selection = getSelection();
	return selection ? selection.anchorOffset === (selection.anchorNode?.textContent?.length ?? 0) : false;
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

export function pasteRaw(event:ClipboardEvent) {
	try {
		const {clipboardData} = event;
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