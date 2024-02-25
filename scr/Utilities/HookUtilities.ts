/** @hook函数工具 */
import * as HT from "../Models/SDKInfo"

export class HookManager {
    private static readonly _hookMap: Map<string, ((args: unknown, next: HT.PatchHook) => void)[]> = new Map();
}