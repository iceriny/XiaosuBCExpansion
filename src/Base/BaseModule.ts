import Settings from "../Setting/Setting";


/**
 * 模块的基础抽象类
 */
export default abstract class BaseModule {
    /** 模块的信息 */
    Info: ModuleInfo = {
        name: "base",
        priority: -999,
        description: "模块基类，所有的模块都继承这个模块"
    }
    protected Setting: Settings | undefined;
    /** 模块是否加载完成 */
    public Loaded: boolean = false;

    constructor(info: ModuleInfo) {
        this.Info = info;
    }

    /**
     * 在模块加载完成后调用
     */
    protected letSuccessfullyLoad(): void {
        this.Loaded = true;
    }

    /**
     * 初始化函数
     */
    public abstract Init(): void
    /**
     * 加载函数
     */
    public abstract Load(): void

    /**
     * 运行模块
     */
    public abstract Run(): void

    /**
     * 卸载模块
     */
    public abstract Unload(): void
}