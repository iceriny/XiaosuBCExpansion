/** @模块加载器 */

import { BaseModule } from "../../Base/BaseModule";

export class ModulesLoader {
    /** @模块集合 用于加载模块 */
    private static modules = new Map<string, BaseModule>();
    /** @模块列表 用于注册模块 并排序*/
    private static modulesList: BaseModule[] = [];

    /** 表示是否成功加载 */
    private static successfulLoaded = false;
    /** 加载模块数量 */
    private static loadedCount = 0;
    private static readonly fullLoadedCount = 0;

    /** @加载模块 */
    public static loadModules() {
        for ( const m of this.modules){
            m[1].Load();
            this.loadedCount++;
        }
        if (this.loadedCount === this.fullLoadedCount) {
            this.successfulLoaded = true;
        }
    }

    /** @注册模块 */
    private static registerModule(module: BaseModule) {
        module
        throw new Error("Method not implemented.");
    }
}