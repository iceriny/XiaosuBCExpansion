import bcModSDKRef from "bondage-club-mod-sdk";
import * as ModInfo from "../Models/ModInfo";


//   VVVVVVVVVVVVVVVVVVVVVVVVVVVVV  ----SDK----  VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV    //
export const bcModSDK = bcModSDKRef.registerMod({
    name: ModInfo.MOD_NAME,
    fullName: ModInfo.MOD_FULL_NAME,
    version: XSBE_VERSION.startsWith("v") ? XSBE_VERSION.slice(1) : XSBE_VERSION,
    repository: ModInfo.REPOSITORY_URL
});

export enum HookPriority {
    Bottom = -100,
    Observe = 0,
    AddBehavior = 1,
    ModifyBehavior = 5,
    OverrideBehavior = 10,
    Top = 100
  }

export type PatchHook = (args: unknown[], next: (args: unknown[]) => unknown) => unknown;
export function hookFunction(target: string, priority: HookPriority, hook: PatchHook): () => void {
    const removeCallback = bcModSDK.hookFunction(target, priority, hook);
    return removeCallback;
}

export function patchFunction(functionName: string, patches: Record<string, string | null>): void {
    bcModSDK.patchFunction(functionName, patches);
}

//    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ----SDK----  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^    //