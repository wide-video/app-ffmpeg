export function caretToEnd(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse();
    
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}