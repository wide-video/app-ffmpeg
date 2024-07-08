import { ProgramName } from "./ProgramName";

export type ProgramAliasName = "man";

export const MAP = <const>{
	"man": "help"
} satisfies Record<ProgramAliasName, ProgramName>