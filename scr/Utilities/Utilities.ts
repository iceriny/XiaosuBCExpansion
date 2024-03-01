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
export function conDebug(msg: XSDebugMSG | string, isError: boolean = false, color: string | null = null, style: string | null = null) {
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
        let theColor = 'rgba(191, 154, 175, 1)';
        if (isError) {
            theColor = 'rgba(255, 0, 0, 1)'
        }
        if (color) {
            theColor = color
        }
        console.debug("%c小酥的模组信息: ", `background-color: ${theColor}; font-weight: bold;`, result);
    }
}

/** 技能倍率buff */
export function SetSkillModifier(name: SkillType, value: number, duration: number) {
    const realLevel = SkillGetLevelReal(Player, name);
    const targetValue = Math.floor(realLevel * value);
    const correction = targetValue - realLevel;
    SkillSetModifier(Player, name, correction, duration);
}

/**
 * 处理结巴效果基于segmenter.segment()分词
 * @param str 传入的字符串
 * @returns 返回处理后的字符串
 */
export function segmentForCH(str: string): string[] | null {
    // 检查浏览器是否支持 Intl.Segmenter
    if (window.Intl && window.Intl.Segmenter && TranslationLanguage.toLowerCase() === "cn") {
        const segmenter = new Intl.Segmenter('zh', { granularity: 'word' }); // 创建分词器实例
        const segmenterResult = segmenter.segment(str); // 对文本进行分词
        const results: string[] = []
        for (const segment of segmenterResult) {
            results.push(segment.segment);
        }

        conDebug(`segmentForCH: ${results}`)
        return results;
    } else {
        return null;
    }
}
/** 呻吟词库 */
const MOAN: string[] = [
    " ❤呀~",
    " 嗯❤~",
    " 姆嗯❤~",
    " 昂~❤",
    " ❤啊~",
    " 哈啊..",
    " 呜❤..",
    " --嘶❤~",
    " 唔❤..",
    " ❤嘶哈~",
    " ❤呀嗯..",
    " ❤.哦~"
];

/**
 * 随机获取一个呻吟字符串
 * @see MOAN
 * @returns 一个呻吟字符串
 */
export function getMoan(): string {
    return MOAN[Math.floor(Math.random() * MOAN.length)];
}

/**
 * 获取一个动态概率 其值在最大值和最小值范围内成S曲线分布
 * @param value 当前值
 * @param min 当前值的最小值
 * @param max 当前值的最大值
 * @param alpha 控制曲线的平缓程度 数值越大越陡峭
 * @param beta 控制曲线的中点 数值越大越靠近最大值
 * @returns 返回一个概率值 范围在0~1之间
 */
export function getDynamicProbability(value: number, min: number = 0, max: number = 100, alpha: number = 1, beta: number = 0.5, reverse: boolean = false): number {
    // 将 value 的范围从 [min, max] 映射到 [0, 1]
    const x = (value - min) / (max - min);

    // 使用 logistic 函数来计算动态概率
    let probability = 1 / (1 + Math.exp(-alpha * max * (x - beta)));
    // 如果需要反向处理则取 1 - probability将曲线左右倒置
    if (reverse) {
        probability = 1 - probability;
    }

    // 返回概率并限制在0~1之间以避免 计算浮点数时的精度丢失 导致的概率溢出
    return LimitedScope(0, 1, probability)
} 

/**
 * 限制一个数值在指定范围内
 * @param min 最小值
 * @param max 最大值
 * @param value 输入值
 * @returns 返回限制后的值
 */
export function LimitedScope(min: number, max: number, value: number): number {
    return Math.min(max, Math.max(min, value));
}