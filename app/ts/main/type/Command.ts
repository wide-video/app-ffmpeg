import { COMMAND_CLEAR } from "~util/Terminal";
import { COMMAND_LS, COMMAND_RM } from "~util/FileSystem";
import * as Embed from "~program/Embed";
import * as Fetch from "~program/Fetch";
import * as Help from "~program/Help";
import * as History from "~util/History";

export type Command =
	ClearCommand
	| `${EmbedCommand} ${string}`
	| `${FetchCommand} ${string}`
	| HelpCommand | `${HelpCommand} ${string}`
	| HistoryCommand
	| LSCommand | `${LSCommand} ${string}`
	| `${RMCommand} ${string}`;

type ClearCommand = typeof COMMAND_CLEAR;
type EmbedCommand = typeof Embed.COMMAND;
type FetchCommand = typeof Fetch.COMMAND;
type HelpCommand = typeof Help.COMMAND;
type HistoryCommand = typeof History.COMMAND;
type LSCommand = typeof COMMAND_LS;
type RMCommand = typeof COMMAND_RM;