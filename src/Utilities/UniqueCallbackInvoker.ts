/**
 * 用于唯一执行回调函数的类
 */
export class UniqueCallbackInvoker<T> {
    private nextArgs: unknown[] = [];


    /**
     * 执行回调函数，如果参数与上次执行的参数相同，则不执行
     * @param callback 回调函数
     * @param args 参数
     * @returns 返回回调函数的返回值或 void
     */
    run(callback: (...args: unknown[]) => T, ...args: unknown[]): T | void {
        if (this.arraysAreEqual(this.nextArgs, args)) return;
        this.nextArgs = args;

        return callback(args);
    }

    /**
     * 判断两个数组是否相等
     * @param arr1 数组1
     * @param arr2 数组2
     * @returns 如果两个数组相等返回 true，否则返回 false
     */
    private arraysAreEqual(arr1: unknown[], arr2: unknown[]) {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
    }
}