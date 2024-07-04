import * as Const from "~/Const";

const ASSET_DIR = Const.ASSET.DIR;
const ASSET_FILES = Const.ASSET.FILES;

const FFMPEG_DIR = Const.FFMPEG.DIR;
const FFMPEG_FILES = Const.FFMPEG.FILES;

export const assetUrl = (asset:Asset) =>
	assetPathUrl(`${ASSET_DIR}/${asset}`);

export const ffmpegUrl = (asset:FFmpegAsset) =>
	assetPathUrl(`${FFMPEG_DIR}/${asset}`);

const assetPathUrl = (path:AssetPath) =>
	new URL(path, Const.BASE_URL).href;

export function getFilename(path:string) {
	try {
		return new URL(path, Const.BASE_URL).pathname.split("/").pop();
	} catch(error) {
		return;
	}
}

type Asset = typeof ASSET_FILES[number];

type FFmpegAsset = typeof FFMPEG_FILES[keyof typeof FFMPEG_FILES];

type AssetPath = `${typeof ASSET_DIR}/${Asset}`
	| `${typeof FFMPEG_DIR}/${FFmpegAsset}`;