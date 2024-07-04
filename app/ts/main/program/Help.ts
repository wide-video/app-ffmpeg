import * as Const from "~/Const";
import * as DOM from "~util/DOM";
import * as Format from "~util/Format";
import { Program } from "~program/Program";
import { System } from "~type/System";
import * as UrlUtil from "~util/UrlUtil";

export class Help extends Program {
	constructor(system:System) {
		super("help", system);
	}

	override run(args:ReadonlyArray<string>) {
		const {name, system:{shell, terminal}} = this;
		const programName = args[0];
		const program = programName ? shell.getProgram(programName) : undefined;
		const element = DOM.div("help");
		element.innerHTML = program ? program.help() : `
${strongLink(Const.BASE_URL, Const.NAME)} `
+`powered by ${strongLink(Const.WIDE_VIDEO_URL, Const.WIDE_VIDEO)} `
+`| Free Online Video Editor
--------------------------------------------------------------

${this.joinSections([...this.manTemplate({
		description:["Print detailed help and examples for the specified program."],
		examples:[
			{description: "Print this help:",
			command:name},
			{description: `Print help for an available program:`
				+ `${Format.NLI}Available programs: ${shell.programs.map(program => this.commandToHTMLStrings(program.name)[0]).join(", ")}`,
			command:`${name} <program>`}
		]}),
	{name:"USAGE", content:[`1. Drag and drop files into the terminal or use the ${this.commandToHTMLStrings("add")} `
		+ `or ${this.commandToHTMLStrings("fetch")} command to populate the virtual file system.`,
		`2. Run ${this.commandToHTMLStrings("ffmpeg")} command.`,
		`3. Save the generated output using the ${this.commandToHTMLStrings("save")} command.`,
		`A few demo assets are available for use: ${Const.ASSET.FILES
			.map(asset => link(UrlUtil.assetUrl(asset), asset)).join(", ")}`
		+ `${Format.NLII}${this.commandToHTMLStrings(`fetch ${UrlUtil.assetUrl("input.mp4")}`)}`]

	},
	{name:"CONTACT", content:[`Contact for help, feedback or discussion on `
		+ Object.entries(Const.SOCIAL_MEDIA).map(([label, url]) => link(url, label)).join(", ")]},
	{name:"COPYRIGHT", content:[`This software uses code of ${link(Const.FFMPEG.ORIGIN, "FFmpeg")} `
		+ `licensed under the ${link(Const.FFMPEG.LICENSE, "GPLv3")} `
		+ `and its source can be downloaded ${link(Const.SOURCES_URL, "here")}.`]}
])}

`;

		terminal.stdout(element);
	}
}

const link = (url:string, label:string) =>
	`<a href="${url}" target="_blank">${label}</a>`;

const strongLink = (url:string, label:string) =>
	link(url, `<strong>${label}</strong>`);