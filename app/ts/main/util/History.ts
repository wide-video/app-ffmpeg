import { Command } from "~type/Command";

const KEY = "history";

export class History {
	readonly max = 50;

	private readonly list:Command[];
	private index:number;

	constructor() {
		try {
			this.list = JSON.parse(localStorage?.getItem(KEY) ?? "[]");
		} catch(error) {
			this.list = [];
		}
		this.index = this.list.length;
	}

	getList():ReadonlyArray<Command> {
		return this.list;
	}

	add(command:Command) {
		const {list, max} = this;
		list.push(command);
		if(list.length > max)
			list.splice(0, list.length - max);
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