import { ProgramName } from "~type/ProgramName";
import { ProgramAliasName } from "./ProgramAliasName";

export type Command = ProgramName | `${ProgramName} ${string}`
	| ProgramAliasName | `${ProgramAliasName} ${string}`;