import BaseModule from "../Base/BaseModule";
import HookManager from "../Utilities/HookManager";
import { conDebug, setAPI } from "../Utilities/Utilities";
// import { DataManager } from "../Utilities/DataManager";


// type wombTattoosLayersName = "Zoom" | "Big" | "Bloom" | "BottomSpike" | "Flash" | "Fly" | "Grass" | "Grow" | "GrowHollow" | "HeartSmallOutline" | "Heartline" | "HeartSmall" | "HeartSolid" | "HeartWings" | "In" | "Leaves" | "MidSpike" | "Ribow" | "Sense" | "Shake" | "SideHearts" | "Swim" | "Thorn" | "ThornOut" | "TopSpike" | "Venom" | "Viper" | "Waves" | "WingSmall";

export default class WombTattoosModule extends BaseModule {
    // 功能搭配 高潮余韵与失神 系统
    // 功能构想:
    // 1. 当高潮余韵大于100时 也就是失能状态时 激活可以对目标角色施加淫纹
    // 2. 当激活角色被激活淫纹时 淫纹会根据条件 进一步发展
    // 3. 随着淫纹的发展程度 会触发不同的淫纹效果
    // 4. 淫纹的发展程度会有额外的触发条件
    // 5. 淫纹分7个阶段
    // 6. 基础阶段为敏感度提升
    // 7. 二为欲望提升 (依托于BCT_API.ActivitySetBCTArousal())

    public Init(): void { }
    public Load(): void { }
    public Run(): void {
        // PreferenceLoad函数在设置界面加载时被调用
        HookManager.setHook("PreferenceLoad", 'PreferenceLoadDebug', 10, () => {

            // 展示了设置如何 包装原函数并替换原函数，并且储存原函数到API的方法，如果后续用的多 可以尝试做出Manager!
            if (typeof PreferenceSubscreenBCTArousalLoad === 'function' && !window.XSBE_API?.originalPreferenceSubscreenBCTArousalLoad) {
                setAPI('originalPreferenceSubscreenBCTArousalLoad', PreferenceSubscreenBCTArousalLoad)
                PreferenceSubscreenBCTArousalLoad = function () {
                    (window.XSBE_API!.originalPreferenceSubscreenBCTArousalLoad as () => void)();
                    // 执行自己的操作!
                    conDebug('My!!   PreferenceSubscreenBCTArousalLoad TEST!!!!')
                    WombTattoosModule.BCTArousalProgressMultiplierInputElement = document.getElementById('InputArousalProgressMultiplier') as HTMLInputElement | null;
                }
            }
        })
    }
    public Unload(): void { }

    private static BCTArousalProgressMultiplierInputElement: HTMLInputElement | null = null;
//InputOrgasmProgressMultiplier InputArousalDecayMultiplier InputOrgasmDecayMultiplier
    /**
     * 判断目标角色是否有淫纹
     */
    public static haveWombTattoos(C: Character | PlayerCharacter): boolean {
        //查找WombTattoos
        for (const item of C.Appearance) {
            if (item.Asset !== null && item.Asset.Name === "WombTattoos") return true;
        }
        return false;
    }

}