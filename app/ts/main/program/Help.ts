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
<a href="${Const.BASE_URL}" target="_blank"><strong>FFmpeg Online</strong></a> `
+`powered by <a href="${Const.WIDE_VIDEO_URL}" target="_blank"><strong>wide.video</strong></a> `
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
		`A few demo assets are available for use:${Format.NLII}${Const.ASSET.FILES
			.map(file => this.commandToHTMLStrings(`fetch ${UrlUtil.assetUrl(file)}`))
			.join(Format.NLII)}`]

	},
	{name:"CONTACT", content:[`Contact for help, feedback or discussion on `
		+ `<a href="https://discord.gg/Q54kW97yj5" target="_blank">Discord</a>, `
		+ `<a href="https://www.facebook.com/fb.wide.video" target="_blank">Facebook</a>, `
		+ `<a href="https://www.reddit.com/r/widevideo" target="_blank">Reddit</a>, `
		+ `<a href="https://www.tiktok.com/@wide.video" target="_blank">TikTok</a>, `
		+ `<a href="https://x.com/wide_video" target="_blank">X</a> or `
		+ `<a href="https://www.youtube.com/@wide-video" target="_blank">YouTube</a>.`]},
	{name:"COPYRIGHT", content:[`This software uses code of <a href="https://ffmpeg.org" target="_blank">FFmpeg</a> `
		+ `licensed under the <a href="https://github.com/FFmpeg/FFmpeg/blob/master/COPYING.GPLv3" target="_blank">GPLv3</a> `
		+ `and its source can be downloaded <a href="https://github.com/wide-video/app-ffmpeg/" target="_blank">here</a>.`]}
])}

`;

		terminal.stdout(element);
	}
}