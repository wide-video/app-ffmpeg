import { ProgramName } from "./ProgramName";

export type ProgramAliasName = "man";

export const MAP = {
	"man": "help"
} as const satisfies Record<ProgramAliasName, ProgramName>