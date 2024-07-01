import { ProgramName } from "~type/ProgramName";

export type Command = ProgramName | `${ProgramName} ${string}`;