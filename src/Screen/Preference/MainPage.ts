// import GUITool from "../Utilities/GUITool";
import BasePage from "../../Base/BasePage";
// import GUITool from "../../Utilities/GUITool";
import ArousalPage from "./ArousalPage";

export default class MainPage extends BasePage {
    public Name: PageName = "XSBE_main";
    protected LabelName: string = "小酥的俱乐部拓展 设置";

    protected subScreen: Map<PageName, BasePage> = new Map();

    protected Components: Array<Component> = [];
    Init(): void {
        // 本页面初始化
        super.Init(ArousalPage);

        // 设置组件
        this.SetComponents(
            <Button>{
                type:"button",
                label:"兴奋与高潮机制",
                HoveringText: "涉及兴奋值和高潮的机制调整。",
                SCRLocation: [350, 200, 350, 60],
                color: "White",
                click: () => {
                    this.subScreen.get('XSBE_arousal')?.PageLoad();
                }
            }
        );
    }
}
