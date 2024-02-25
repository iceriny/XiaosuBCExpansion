/** @hook函数工具 */
// import { ModulePriority } from "../Models/ModuleInfo";
import * as HT from "../Models/SDKInfo"
// import { hookFunction, removePatches } from "./BCSDK";
import { hookFunction } from "./BCSDK";


/**
 * Hook管理器
 */
export class HookManager {

    /**
     * 钩子映射表
     */
    private static readonly _hookMap: Map<string, CompleteHookItem> = new Map();
    private static get NewHookItem(): HookItem<HookItemContent> {
        return new HookItem<HookItemContent>();
    }

    /**
     * 设置钩子函数
     * @param functionName 函数名
     * @param name 钩子名
     * @param priority 钩子优先级
     * @param code 钩子函数
     */
    static setHook(functionName: string, name: string, priority: number, code: (args: unknown, next: HT.PatchHook) => void) {
        // 获取函数对应的钩子项
        const hookItem = HookManager._hookMap.get(functionName);
        if (hookItem) {
            // 如果钩子项存在，则设置钩子函数
            if (priority > 0) hookItem[0].add(name, { priority, code });
            else hookItem[1].add(name, { priority, code });
        } else {
            // 如果钩子项不存在，则创建新的钩子项，并设置钩子函数
            const topItem = this.NewHookItem;
            const bottom = this.NewHookItem;
            const _item: CompleteHookItem = [topItem, bottom, new Set()];
            if (priority > 0) {
                topItem.add(name, { priority, code });
                _item[2].add(name);
            }
            else bottom.add(name, { priority, code });

            HookManager._hookMap.set(functionName, _item);
        }
    }

    /**
     * 移除钩子函数
     * @param functionName 钩子函数名
     * @param name 钩子名称
     */
    static removeHook(functionName: string, name: string) {
        // 获取HookItem
        const hookItem = HookManager._hookMap.get(functionName);
        // 如果HookItem存在
        if (hookItem) {
            if (hookItem[2].has(name)) {
                hookItem[2].delete(name);
                hookItem[0].delete(name);
            } else hookItem[1].delete(name);

            if (hookItem[0].size === 0 && hookItem[1].size === 0) {
                // 如果HookItem为空，则删除HookItem
                HookManager._hookMap.delete(functionName);
                // removePatches(functionName);  设想动态的hook函数 暂时没想到怎么动态的添加 ////////////////////
            }
        }
    }

    /**
     * 运行钩子函数
     */
    static runHook() {
        for (const [functionName, completeHookItem] of HookManager._hookMap.entries()) {
            hookFunction(functionName, 0, (args, next) => {
                completeHookItem[0].forEach(item => item.code(args, next));
                const result = next(args);
                completeHookItem[1].forEach(item => item.code(result, next));
                return result;
            });
        }
    }
}
/**
 * 完整的钩子项
 */
type CompleteHookItem = [top: HookItem<HookItemContent>, bottom: HookItem<HookItemContent>, topHookSet: Set<string>]
/**
 * 钩子项内容
 */
interface HookItemContent {
    priority: number;
    code: (args: unknown, next: HT.PatchHook) => void;
}

class HookItem<T extends HookItemContent> implements Iterable<T> {
    // 存储 HookItem 的映射关系
    private itemMap: { [key: string]: T };
    // 存储 HookItem 的顺序
    private itemSequence: string[];
    // 存储 HookItem 的数量
    size: number;

    constructor() {
        // 初始化 itemMap
        this.itemMap = {}
        // 初始化 itemSequence
        this.itemSequence = [];
        // 初始化 size
        this.size = 0;
    }

    // 添加 HookItem
    add(name: string, content: T) {
        // 将 content 添加到 itemMap 中
        this.itemMap[name] = content;
        // 查找插入位置
        let index = this.itemSequence.findIndex(item => this.itemMap[item].priority < content.priority);
        if (index === -1) {
            // 如果找不到比插入值更小的元素，说明插入值最小，放在数组末尾
            index = this.size;
        }
        // 使用 splice() 方法插入元素
        this.itemSequence.splice(index, 0, name);
        // 更新 size
        this.size++;
    }

    // 删除 HookItem
    delete(name: string) {
        // 从 itemMap 中删除指定的 HookItem
        delete this.itemMap[name];
        // 从 itemSequence 中删除指定的 HookItem
        const index = this.itemSequence.indexOf(name);
        this.itemSequence.splice(index, 1);
        // 更新 size
        this.size--;
    }

    // 遍历 HookItem
    forEach(callback: (value: T) => void): void {
        // 遍历 itemSequence，调用回调函数
        for (const key of this.itemSequence) {
            callback(this.itemMap[key]);
        }
    }

    // 实现 Symbol.iterator 方法，返回一个迭代器
    [Symbol.iterator](): Iterator<T> {
        let index = 0;
        const keys = this.itemSequence;
        const map = this.itemMap
        return {
            next(): IteratorResult<T> {
                if (index < keys.length) {
                    // 如果还有元素，返回当前元素
                    return { done: false, value: map[keys[index++]] };
                } else {
                    // 如果没有元素，返回结束状态
                    return { done: true, value: undefined };
                }
            }
        };
    }
}