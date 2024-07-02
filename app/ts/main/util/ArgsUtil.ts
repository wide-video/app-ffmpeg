export function escape(value:String) {
	return value.replaceAll(/(\s)/g, "\\$1");
}