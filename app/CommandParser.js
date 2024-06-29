/*
test:
  aFa  "bbb  ccc" 'ddd  eee'  -123      456 č中文 8 \
 a bb  c
*/
export function parse(line) {
    let singleQuoteOpen = false;
    let doubleQuoteOpen = false;
    let buffer = "";
    const args = [];
    const length = line.length;
    for(let i = 0; i < length; i++) {
        const token = line[i];
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

    const command = args.shift();
    return {line, command, args};
}