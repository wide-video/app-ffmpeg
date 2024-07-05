import * as Const from "~/Const";
import * as DOM from "~util/DOM";
import * as Format from "~util/Format";
import { Program } from "~program/Program";
import { System } from "~type/System";
import * as UrlUtil from "~util/UrlUtil";

export class Intro extends Program {
	constructor(system:System) {
		super("intro", system);
	}

	override run() {
		const element = DOM.div("help");
		element.innerHTML = `
${Format.strongLink(Const.BASE_URL, Const.NAME)} `
+`powered by ${Format.strongLink(Const.WIDE_VIDEO_URL, Const.WIDE_VIDEO)} `
+`| Free Online Video Editor
--------------------------------------------------------------

Run ffmpeg directly in your browser with a terminal-like interface. No installations needed. Convert, edit, and process multimedia files with this powerful web-based tool.

${this.joinSections([
	{name:"USAGE", content:[`1. Drag and drop files into the terminal or use the ${this.commandToHTMLStrings("add")} `
		+ `or ${this.commandToHTMLStrings("fetch")} command to populate the virtual file system.`,
		`2. Run ${this.commandToHTMLStrings("ffmpeg")} command.`,
		`3. Save the generated output using the ${this.commandToHTMLStrings("save")} command.`,
		`Demo assets available for use: ${Const.ASSET.FILES
			.map(asset => Format.link(UrlUtil.assetUrl(asset), asset)).join(", ")}`
		+ `${Format.NLII}${this.commandToHTMLStrings(`fetch ${UrlUtil.assetUrl("input.mp4")}`)}`,
		`Run ${this.commandToHTMLStrings("help")} for available commands.`,
		`Explore ${Format.link(Const.SOURCES_URL, "embedding and more")} features.`
		]

	},
	{name:"CONTACT", content:[`Contact for help, feedback or discussion on `
		+ Object.entries(Const.SOCIAL_MEDIA).map(([label, url]) => Format.link(url, label)).join(", ")]},
	{name:"COPYRIGHT", content:[`This software uses code of ${Format.link(Const.FFMPEG.ORIGIN, "FFmpeg")} `
		+ `licensed under the ${Format.link(Const.FFMPEG.LICENSE, "GPLv3")} `
		+ `and its source can be downloaded ${Format.link(Const.SOURCES_URL, "here")}.`]}
])}

`;

		this.system.terminal.stdout(element);
	}
}