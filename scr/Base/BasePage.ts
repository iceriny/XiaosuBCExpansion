// import HookManager from "../Utilities/Manager/HookManager";
import GUITool from "../Utilities/GUITool";
// 定义一个泛型接口，用于描述类的构造函数类型
interface PageConstructor<T extends BasePage> {
    new(previousScreen: BasePage): T;
}
export default abstract class BasePage {
    /** 退出按钮的位置 */
    protected static readonly ExitButton: { SCRLocation: SCRLocation } = { SCRLocation: [1815, 75, 90, 90] }
    /** 保存的原游戏的退出函数 */
    protected static OriginExitFunction: (() => void) | undefined;
    // private static OriginTextAlign: CanvasTextAlign | undefined;   // TextAlign

    /** 页面名称 */
    public abstract Name: PageName;

    /** 页面标题 */
    protected abstract LabelName: string;
    /** 标题对象 */
    private Label: Label = {
        type: "label",
        label: "",
        SCRLocation: [500, 110, 0, 0],
        color: "black"
    };
    /** 上一个页面(父级页面) */
    protected previousScreen: BasePage | null;
    /** 子页面 */
    protected abstract subScreen: Map<string, BasePage>;
    /** 页面组件 */
    protected abstract Components: Array<Components>;

    /**
     * 生成一个新的子页面
     * @param ctor 子页面的构造函数
     * @returns 生成的子页面
     */
    protected GetNewSubPage<T extends BasePage>(ctor: PageConstructor<T>): T {
        // 生成一个子页面
        const newSub = new ctor(this);
        // 将子页面添加到子页面集合中
        this.subScreen.set(newSub.Name, newSub);
        return newSub;
    }

    /**
     * 构造函数
     * @param previousScreen 父级页面
     */
    constructor(previousScreen: BasePage | null = null) {
        // 初始化页面 (设置父级页面)
        this.previousScreen = previousScreen;
    }

    /**
     * 页面初始化
     * @param ctors 构建子页面的构造函数
     */
    protected Init<T extends BasePage>(...ctors: PageConstructor<T>[]): void {
        // 初始化标题
        this.Label.label = this.LabelName;
        // 创建一个方法映射对象
        const methods = {
            RunSubscreen: this.RunSubscreen.bind(this),
            ClickSubscreen: this.ClickSubscreen.bind(this),
        };

        // 动态生成属性名并赋值 用于在游戏原函数(PreferenceRun() 与 PreferenceClick()) 中动态调用
        const name = `PreferenceSubscreen${this.Name}`;
        window[name + 'Run'] = methods.RunSubscreen;
        window[name + 'Click'] = methods.ClickSubscreen;

        // 添加标题组件
        this.Components.push(this.Label);

        // 创建子页面
        ctors.forEach(ctor => {
            this.GetNewSubPage(ctor);
        });
        // 初始化子页面
        this.subScreen.forEach(subPage => {
            subPage.Init();
        });
    }


    /**
     * 页面载入
     */
    PageLoad(): void {
        // 缓存原退出函数
        if (!BasePage.OriginExitFunction) BasePage.OriginExitFunction = CurrentScreenFunctions.Exit;
        // if (!BasePage.OriginTextAlign) BasePage.OriginTextAlign = GUITool.TextAlign;    // TextAlign
        // 将原游戏所调用的退出函数设置为当前页面的退出函数
        CurrentScreenFunctions.Exit = this.Exit.bind(this);
        // 设置页面为本页面
        this.SetScreen(this.Name);
    }

    /**
     * 页面的运行函数
     * 每帧运行一次
     */
    private RunSubscreen(): void {
        // 绘制退出按钮
        GUITool.DrawButton(BasePage.ExitButton.SCRLocation, "", "White", "Icons/Exit.png");
        // 绘制组件
        // GUITool.TextAlign = 'left';    // TextAlign
        for (const c of this.Components) {
            GUITool.DrawComponent(c);
        }
        // GUITool.TextAlign = BasePage.OriginTextAlign!;    // TextAlign
    }

    /**
     * 页面的 点击事件 函数
     */
    private ClickSubscreen(): void {
        // 如果点击退出按钮 则执行退出函数
        if (GUITool.MouseIn(BasePage.ExitButton.SCRLocation)) this.Exit();
        // 判断组件的点击事件
        for (const c of this.Components) {
            if (GUITool.MouseIn(c.SCRLocation)) c.click?.();
        }
    }

    /**
     * 页面的退出函数
     */
    private Exit(): void {
        //  如果页面为根页面 则将原游戏的退出函数还原 并且设置当前页面为角色面板的页面(空字符串"")
        if (this.previousScreen === null) {
            CurrentScreenFunctions.Exit = BasePage.OriginExitFunction;
            BasePage.OriginExitFunction = undefined;

            // GUITool.TextAlign = BasePage.OriginTextAlign!;    // TextAlign
            // BasePage.OriginTextAlign = undefined;    // TextAlign
            this.SetScreen("");
        } else { // 设置当前页面为上一个页面
            this.previousScreen.PageLoad();
        }
    }

    /**
     * 设置本页面的组件
     * @param components 要添加的组件
     */
    protected SetComponents(...components: Array<Components>): void {
        components.forEach(c => this.Components.push(c));
    }

    /**
     * 设置当前页面 用于@PageLoad
     * @param PageName 要设置的页面名称
     */
    private SetScreen(PageName: PageName | "") {
        PreferenceSubscreen = PageName;
    }

    /**
     * 获取所有子页面的迭代器函数
     */
    *getAllSubPages(): IterableIterator<BasePage> {
        for (const subPage of this.subScreen.values()) {
            yield subPage;
            yield* subPage.getAllSubPages();
        }
    }

}