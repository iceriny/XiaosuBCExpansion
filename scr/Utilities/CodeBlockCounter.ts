export class CodeBlockCounter<T> {
    private counter: number;
    private maxCount: number;
    private active: boolean;
    constructor(maxCount: number) {
        this.counter = 0;
        this.active = true;
        this.maxCount = maxCount;
    }

    run( callback: (...args: unknown[]) => T, ...args: unknown[]): T | void {
        if (!this.active) return;
        this.counter++;
        if (this.counter >= this.maxCount) this.active = false;

        return callback(args);
    }

    activate() {
        this.active = true;
        this.counter = 0;
    }
}