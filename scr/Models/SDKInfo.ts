import {ModulePriority} from "./ModuleInfo"

export type PatchHook = (args: unknown[], next: (args: unknown[]) => unknown) => unknown;

export type HookPriority = ModulePriority