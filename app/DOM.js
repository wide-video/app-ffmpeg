export function create(tagName, className) {
    const result = document.createElement(tagName);
    if(className)
        result.className = className;
    return result;
}

export function div(className) {
    return create("div", className);
}

export function span(className) {
    return create("span", className);
}