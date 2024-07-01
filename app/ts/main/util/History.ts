const KEY = "history";
const MAX = 50;

export const COMMAND = "history";

export class History {
	private readonly list:string[];
	private index:number;

	constructor() {
		try {
			this.list = JSON.parse(localStorage?.getItem(KEY) ?? "[]");
		} catch(error) {
			this.list = [];
		}
		this.index = this.list.length;
	}

	getList() {
		return this.list;
	}

	add(line:string) {
		const list = this.list;
		list.push(line);
		if(list.length > MAX)
			list.splice(0, list.length - MAX);
		this.index = list.length;
		try {
			localStorage.setItem(KEY, JSON.stringify(list));
		} catch(error) {}
	}

	move(delta:number) {
		const {index, list} = this;
		this.index = Math.min(Math.max(index + delta, 0), list.length);
		return list[this.index];
	}
}