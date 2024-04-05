import bcModSDKRef from "bondage-club-mod-sdk";
import * as ModInfo from "../Models/ModInfo";


//   VVVVVVVVVVVVVVVVVVVVVVVVVVVVV  ----SDK----  VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV    //
export const bcModSDK = bcModSDKRef.registerMod({
    name: ModInfo.MOD_NAME,
    fullName: ModInfo.MOD_FULL_NAME,
    version: XSBE_VERSION.startsWith("v") ? XSBE_VERSION.slice(1) : XSBE_VERSION,
    repository: ModInfo.REPOSITORY_URL
});
export function hookFunction(target: string, priority: HookPriority, hook: PatchHook): () => void {
    // @ts-expect-error: 兼容1.2.0modSDK
    const removeCallback = bcModSDK.hookFunction(target, priority, hook);
    return removeCallback;
}

export function patchFunction(functionName: string, patches: Record<string, string | null>): void {
    bcModSDK.patchFunction(functionName, patches);
}

export function removePatches(functionName: string){
    bcModSDK.removePatches(functionName);
}

//    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^  ----SDK----  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^    //