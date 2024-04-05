type PatchHook = (args: unknown[], next: (args: unknown[]) => unknown) => unknown;

type HookPriority = ModulePriority