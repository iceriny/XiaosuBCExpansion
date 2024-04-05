// import GUITool from "../Utilities/GUITool";
import BasePage from "../../Base/BasePage";

export default class ArousalPage extends BasePage {
    public Name: PageName = "XSBE_arousal";
    public LabelName: string = "XSBE 兴奋与高潮机制 设置";

    public subScreen: Map<PageName, BasePage> = new Map();

    public Components: Array<Component> = [];
    Init(): void {
        super.Init();

        // this.SetComponents(
        //     <Button>{
        //         type:"button",
        //         label:"兴奋与高潮机制",
        //         HoveringText: "涉及兴奋值和高潮的机制调整。",
        //         SCRLocation: [0,0,0,0],
        //         click: () => {
        //             //this.SetScreen(this.subScreen)
        //         }
        //     }
        // );
    }
}
