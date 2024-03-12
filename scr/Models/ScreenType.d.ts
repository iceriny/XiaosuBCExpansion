
type PagePrefix = "XSBE_";
type PageSuffix = "main" | "arousal"
/**
 * 页面名称
 */
type PageName = `${PagePrefix}${PageSuffix}`;
/**
 * 坐标位置，X 和 Y 以及 长宽 规定位置和大小
 */
type SCRLocation = [left: number, top: number, width: number, height: number];
/**
 * 对其的枚举类型
 */
type Alignment = "Top" | "Center";
/**
 * GUI组件类型
 */
type ComponentsType = "label" | "button" | "checkbox";
/**
 * 组件接口
 */
interface Components {
    type: ComponentsType;
    SCRLocation: SCRLocation;
    color: string;
    click?(): ()=> void;
}
/**
 * 标题接口
 */
interface Label extends Components {
    type: 'label';
    label: string;
    color: string;
}
/**
 * 按钮接口
 */
interface Button extends Components {
    type: 'button';
    label: string;
    img?: string;
    HoveringText?: string;
    Disabled?: boolean;
}
/**
 * 复选框接口
 */
interface Checkbox extends Components {
    type: 'checkbox';
    label: string;
    Checked: boolean;
    Disabled?: boolean;
    TextColor?: string;
}