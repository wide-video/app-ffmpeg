import * as DOM from "~util/DOM";
import { Program } from "~program/Program";
import { System } from "~type/System";

export class Help extends Program {
	constructor(system:System) {
		super("help", system);
	}

	override run() {
		const {name, system:{shell, terminal}} = this;
		const element = DOM.div("help");
		element.innerHTML = `
FFmpeg Online powered by <a href="https://wide.video/" target="_blank"><strong>wide.video</strong></a> | Free Online Video Editor
--------------------------------------------------------------

<strong>SYNOPSIS</strong>
    Available programs: ${shell.programs.map(program => `<span class="program">${program.name}</span>`).join(", ")}

    Run <span class="program">${name}</span> <span class="arg">&lt;program&gt;</span> for detailed help.

<strong>CONTACT</strong>
    Contact for help, feedback or discussion on `
+ `<a href="https://discord.gg/Q54kW97yj5" target="_blank">Discord</a>, `
+ `<a href="https://www.facebook.com/fb.wide.video" target="_blank">Facebook</a>, `
+ `<a href="https://www.reddit.com/r/widevideo" target="_blank">Reddit</a>, `
+ `<a href="https://www.tiktok.com/@wide.video" target="_blank">TikTok</a>, `
+ `<a href="https://x.com/wide_video" target="_blank">X</a> or `
+ `<a href="https://www.youtube.com/@wide-video" target="_blank">YouTube</a>.

<strong>COPYRIGHT</strong>
    This software uses code of <a href="https://ffmpeg.org" target="_blank">FFmpeg</a> `
+ `licensed under the <a href="https://github.com/FFmpeg/FFmpeg/blob/master/COPYING.GPLv3" target="_blank">GPLv3</a> `
+ `and its source can be downloaded <a href="https://github.com/wide-video/app-ffmpeg/" target="_blank">here</a>.

`;

		terminal.stdout(element);
	}
}