export function escape(value:string) {
	if(value === "")
		return '""';
	if(value.includes("'") || value.includes('"'))
		return JSON.stringify(value);
	return value.replaceAll(/(\s)/g, "\\$1");
}