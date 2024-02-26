/**
 * Debug信息对象接口
 */
interface XSDebugMSG {
    name?: string;
    type?: DebugMSGType;
    content: unknown;
}
/**
 * Debug信息类型
 */
export enum DebugMSGType {
    DebugLog,
    Workflow_Log,
}
/**
 * 发送debug信息到控制台
 * @param msg 信息
 * @param color 可选颜色参数
 * @param style 可选的css风格参数
 * @returns 无
 */
export function conDebug(msg: XSDebugMSG | string, color: string | null = null, style: string | null = null) {
    if (DEBUG === false) return;


    const result: object = typeof msg === "string" ? {
        name: "XiaoSuActivity_Debug",
        type: DebugMSGType.DebugLog,
        content: msg,
        time: new Date().toLocaleString(),
        ModVersion: XSBE_VERSION,
    } : {
        name: msg.name,
        type: msg.type,
        content: msg.content,
        time: new Date().toLocaleString(),
        ModVersion: XSBE_VERSION
    }
    if (style) {
        console.debug("%c小酥的模组信息: ", style, result);
    } else {
        if (color) {
            style = `background-color: ${color}; font-weight: bold;`
        }
        console.debug("%c小酥的模组信息: ", 'background-color: rgba(191, 154, 175, 1); font-weight: bold;', result);
    }
}

