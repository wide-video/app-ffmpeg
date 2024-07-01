declare global {
	// https://wicg.github.io/file-system-access/#enumdef-wellknowndirectory
	type WellKnownDirectory = "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";

	// https://wicg.github.io/file-system-access/#api-filepickeroptions-starting-directory
	// https://wicg.github.io/file-system-access/#api-showdirectorypicker
	type StartingDirectory = {
		readonly id?:string; // If id’s length is more than 32, throw a TypeError.
		readonly startIn?:FileSystemHandle | WellKnownDirectory;
	}

	type FilePickerOptionsType = {
		readonly description?:string;
		readonly accept:Record<string, ReadonlyArray<string>>;
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker
	type SaveFilePickerOptions = {
		readonly excludeAcceptAllOption?:boolean;

		// https://github.com/WICG/file-system-access/blob/main/SuggestedNameAndDir.md
		readonly startIn?:"desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";

		// https://github.com/WICG/file-system-access/blob/main/SuggestedNameAndDir.md#interaction-of-suggestedname-and-accepted-file-types
		readonly suggestedName?:string;

		readonly types?:FilePickerOptionsType[];
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker
	// https://wicg.github.io/file-system-access/#api-filepickeroptions
	type OpenFilePickerOptions = StartingDirectory & {
		readonly multiple?:boolean;
		readonly excludeAcceptAllOption?:boolean;
		readonly types?:FilePickerOptionsType[];
	}

	const showOpenFilePicker:(options?:OpenFilePickerOptions) => Promise<(FileSystemFileHandle | FileSystemDirectoryHandle)[]>;
	const showDirectoryPicker:(options?:StartingDirectory) => Promise<FileSystemDirectoryHandle>;
	const showSaveFilePicker:(options?:SaveFilePickerOptions) => Promise<FileSystemFileHandle>;

	interface DataTransferItem {
		getAsFileSystemHandle():Promise<FileSystemDirectoryHandle | FileSystemFileHandle>;
	}
}

export {}