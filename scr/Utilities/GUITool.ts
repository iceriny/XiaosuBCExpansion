/**
 * GUITool 类提供了一系列用于创建和管理图形用户界面元素的静态方法。
 */
export default class GUITool {

    /**
     * 检查给定的坐标是否在鼠标范围内。
     * @param Location 坐标位置，X 和 Y 以及 长宽 规定判定范围
     * @returns 返回一个布尔值，表示鼠标是否在指定区域内。
     */
    static MouseIn(Location: SCRLocation): boolean {
        return MouseIn(Location[0], Location[1], Location[2], Location[3]);
    }

    /**
     * 绘制一个按钮。
     * @param SCRLocation 坐标位置，X 和 Y 以及 长宽 规定位置和大小
     * @param label 按钮上显示的文本。
     * @param color 按钮的背景颜色。
     * @param img 可选，按钮的背景图像。
     * @param HoveringText 可选，鼠标悬停时显示的文本。
     * @param Disabled 可选，是否禁用按钮。
     */
    static DrawButton(SCRLocation: SCRLocation,
        label: string, color: string, img?: string, HoveringText?: string, Disabled?: boolean): void {
        DrawButton(SCRLocation[0], SCRLocation[1], SCRLocation[2], SCRLocation[3], label, color, img, HoveringText, Disabled);
    }

    /**
     * 绘制一段文本，能够自动换行。
     * @param Text 要绘制的文本。
     * @param SCRLocation 坐标位置，X 和 Y 以及 长宽 规定位置和大小
     * @param ForeColor 文本的颜色。
     * @param BackColor 可选，文本的背景颜色。
     * @param MaxLine 可选，最大显示行数。
     * @param LineSpacing 可选，行间距，默认为23。
     * @param Alignment 可选，文本的对齐方式，默认为居中。
     */
    static DrawTextWrap(Text: string,
        SCRLocation: SCRLocation,
        ForeColor: string, BackColor?: string,
        MaxLine?: number, LineSpacing: number = 23, Alignment: Alignment = "Center") {

        DrawTextWrap(Text, SCRLocation[0], SCRLocation[1], SCRLocation[2], SCRLocation[3], ForeColor, BackColor, MaxLine, LineSpacing, Alignment);
    }

    /**
     * 绘制一段文本。
     * @param Text 要绘制的文本。
     * @param SCRLocation 坐标位置，X 和 Y 以及 长宽 规定位置和大小
     * @param ForeColor 文本的颜色。
     * @param BackColor 可选，文本的背景颜色。
     */
    static DrawText(Text: string,
        SCRLocation: SCRLocation,
        ForeColor: string, BackColor?: string) {
        DrawText(Text, SCRLocation[0], SCRLocation[1], ForeColor, BackColor);
    }

    /**
     * 绘制一个复选框。
     * @param SCRLocation 复选框的坐标位置，X 和 Y 以及 长宽 规定位置和大小
     * @param label 复选框旁边的文本标签。
     * @param Checked 复选框是否被选中。
     * @param Disabled 可选，复选框是否被禁用，默认为false。
     * @param TextColor 可选，复选框文本的颜色，默认为黑色。
     */
    static DrawCheckbox(SCRLocation: SCRLocation, label: string, Checked: boolean, Disabled?: boolean, TextColor = "Black") {
        DrawCheckbox(SCRLocation[0], SCRLocation[1], SCRLocation[2], SCRLocation[3], label, Checked, Disabled ?? false, TextColor);
    }

    /**
     * 根据组件类型绘制相应的界面元素。
     * @param Component 要绘制的组件对象。
     */
    static DrawComponent(Component: Components) {
        switch (Component.type) {
            case "button": {
                const button = Component as Button;
                this.DrawButton(button.SCRLocation, button.label, button.color, button.img, button.HoveringText, button.Disabled);
                break;
            }
            case "checkbox": {
                const checkbox = Component as Checkbox;
                this.DrawCheckbox(checkbox.SCRLocation, checkbox.label, checkbox.Checked, checkbox.Disabled, checkbox.TextColor);
                break;
            }
            case "label": {
                const label = Component as Label;
                this.DrawText(label.label, label.SCRLocation, label.color);
            }
        }
    }

    /**
     * 设置主画布的文本对齐方式
     * @param testAlign 要设置的文本对齐方式
     * 类型为CanvasTextAlign:  "center" | "end" | "left" | "right" | "start"
     */
    static set TextAlign(testAlign: CanvasTextAlign) {
        MainCanvas.textAlign = testAlign; // 设置主画布的文本对齐方式
    }

    /**
     * 获取主画布当前的文本对齐方式
     * @returns 返回主画布当前的文本对齐方式
     */
    static get TextAlign() {
        return MainCanvas.textAlign;
    }
}