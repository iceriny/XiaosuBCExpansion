/** @模块加载器 */

import RoomLockModule from "Modules/RoomLock";
import BaseModule from "../../Base/BaseModule";
import ArousalModule from "../../Modules/Arousal";
import WombTattoosModule from "../../Modules/WombTattoos";
import { conDebug } from "../Utilities";

export default class ModulesLoader {
    /** @模块集合 用于加载模块 */
    private static modules = new Map<moduleName, BaseModule>();
    /** @模块列表 用于注册模块 并排序*/
    private static modulesList: BaseModule[] = [];

    /** 表示是否成功加载 */
    public static successfulLoaded = false;
    /** 加载模块数量 */
    private static loadedCount = 0;
    private static readonly fullLoadedCount = 2;

    /** @注册模块 */
    public static registerModule() {
        for (const n in this.modulesBuilder) {
            if (n === 'base') continue;
            const module = this.modulesBuilder[n as moduleName]();
            this.modulesList.push(module);
        }
        this.modulesList.sort((a, b) => {
            if (a.Info.priority === b.Info.priority) {
                return 0;
            }
            return a.Info.priority > b.Info.priority ? 1 : -1;
        });
        for (const m of this.modulesList) this.modules.set(m.Info.name, m);
    }

    /** @初始化模块 */
    public static initModules() {
        for (const [name, module] of this.modules) {
            module.Init();
            conDebug(`模块 ${name} 初始化完成`);
        }
        conDebug(`模块初始化结束`);
    }

    /** @加载模块 */
    public static loadModules() {
        for (const [name, m] of this.modules) {
            m.Load();
            this.loadedCount++;
            conDebug(`模块 ${name} 加载完成`);
        }
        conDebug(`模块加载结束 ${this.loadedCount}/${this.fullLoadedCount}`);
        if (this.loadedCount === this.fullLoadedCount) {
            this.successfulLoaded = true;
            conDebug(`模块加载完成!`);
        }
    }

    /** @运行模块 */
    public static runModules() {
        for (const [name, module] of this.modules) {
            module.Run();
            conDebug(`模块 ${name} 运行完成`);
        }
        conDebug(`模块运行结束`);
    }

    /**
     * 获取已加载的特定模块
     * @param name 需要获取的模块名字
     * @returns 获取到的模块
     */
    public static getModule<T extends BaseModule>(name: moduleName): T {
        return this.modules.get(name) as T;
    }


    /** @模块生成器 用于生成模块 */
    private static modulesBuilder: { [key in moduleName]: () => BaseModule } = {
        base: () => { throw new Error("BaseModule 不应该被创建") },
        WombTattoosModule: () => {
            return new WombTattoosModule({
                name: "WombTattoosModule",
                priority: 0,
                description: "淫纹相关的模块。修改与拓展了游戏淫纹的功能。"
            })
        },
        ArousalModule: () => {
            return new ArousalModule({
                name: "ArousalModule",
                priority: 0,
                description: "Arousal模块。修改与拓展了游戏Arousal的功能。包括高潮等机制。"
            })
        },
        RoomLockModule: () => {
            return new RoomLockModule({
                name: "RoomLockModule",
                priority: 0,
                description: "RoomLock模块。修改与拓展了游戏RoomLock的功能。"
            })
        },
    }

}