import { hookFunction } from "./BCSDK";
// import { conDebug } from "./Utilities";

type RegisteredProcessItem = { priority: number, nextInterval: number, interval: number | (() => number), condition: () => boolean, nextTriggerTime: number }
export default class TimerProcessInjector {
    private static ProcessSequence: TimerProcessInjectorSequence;
    private static RegisteredProcess: Map<string, RegisteredProcessItem>;
    private static ProcessCodeMap: Map<string, () => void>;
    private static processSortList: string[];
    private static activatedProcess: string[];

    public static Init(): void {
        this.ProcessSequence = new TimerProcessInjectorSequence();
        this.RegisteredProcess = new Map<string, RegisteredProcessItem>;
        this.ProcessCodeMap = new Map<string, () => void>
        this.activatedProcess = [];
        this.processSortList = [];
    }

    public static Load(): void {

        this.sortProcessList();
        for (const name of this.processSortList) {
            const item = this.RegisteredProcess.get(name)!
            const itemInterval = item.interval;
            if (typeof itemInterval === "function") {
                item.nextInterval = itemInterval();
            } else {
                item.nextInterval = itemInterval;
            }
        }
    }

    public static Run(): void {
        hookFunction("TimerProcess", 100, (args, next) => {
            this.activatedProcess = [];

            const currentTime = Date.now();
            // 进行条件判断 如果条件通过 则将代码放入激活列表中
            for (const name of this.processSortList) {
                const item = this.RegisteredProcess.get(name)!
                if (item.interval == 0){
                    this.activatedProcess.push(name);
                    continue;
                }

                if (item.nextTriggerTime <= currentTime) {
                    item.nextTriggerTime = currentTime + item.nextInterval;
                    if (item.condition()) {
                        this.activatedProcess.push(name);
                    }
                }
                if (typeof item.interval === "function") {
                    item.nextInterval = item.interval();
                }
            }
            // 通过将激活列表的所有值遍历添加到ProcessSequence中
            this.ProcessSequence.clear();
            for (const name of this.activatedProcess) {
                this.ProcessSequence.add({ code: this.ProcessCodeMap.get(name)!, name: name });
            }

            this.ProcessSequence.run(this.activatedProcess);

            // 交给ProcessSequence 进行执行
            return next(args)
        });
    }

    private static sortProcessList() {
        this.processSortList.sort((a, b) => {
            return this.RegisteredProcess.get(b)!.priority - this.RegisteredProcess.get(a)!.priority;
        });
    }


    public static add(priority: number, interval: number | (() => number), condition: () => boolean, codeItem: TimerProcessInjectorCodeContent) {
        if (this.RegisteredProcess.has(codeItem.name)) return;
        this.RegisteredProcess.set(codeItem.name, {
            interval: interval,
            nextInterval: -1,//////
            condition: condition,
            priority: priority,
            nextTriggerTime: 0//////
        });
        this.ProcessCodeMap.set(codeItem.name, codeItem.code);
        this.processSortList.push(codeItem.name);
    }
}

interface TimerProcessInjectorCodeContent {
    code: () => void;
    name: string;
}
type TimerProcessInjectorCodeMap = Map<string, TimerProcessInjectorCodeContent>;

class TimerProcessInjectorSequence {
    private codeMap: TimerProcessInjectorCodeMap;
    size: number;

    constructor() {
        this.codeMap = new Map<string, TimerProcessInjectorCodeContent>();
        this.size = 0;
    }

    add(codeItem: TimerProcessInjectorCodeContent) {
        if (this.codeMap.has(codeItem.name)) {
            return;
        }
        this.codeMap.set(codeItem.name, codeItem);
        this.size++;
    }

    has(name: string) {
        return this.codeMap.has(name);
    }
    remove(name: string) {
        this.codeMap.delete(name);
        this.size--;
    }
    clear() {
        this.codeMap.clear();
        this.size = 0;
    }

    run(runList: string[]) {
        for (const name of runList) {
            this.codeMap.get(name)?.code();
        }
    }
}
