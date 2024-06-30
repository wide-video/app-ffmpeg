export function caretAtStart() {
    return !getSelection().anchorOffset;
}

export function caretAtEnd() {
    const {anchorNode, anchorOffset} = getSelection();
    return anchorOffset === anchorNode.textContent.length;
}

export function caretToEnd(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse();
    
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

export function pasteRaw(event) {
    try {
        const text = event.clipboardData.getData("text/plain");
        const selection = getSelection();
        if(!selection.rangeCount)
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