import { BaseModule } from "../Base/BaseModule";
// import { HookManager } from "../Utilities/HookManager";
// import { conDebug } from "../Utilities/Utilities";
// import { DataManager } from "../Utilities/DataManager";


// type wombTattoosLayersName = "Zoom" | "Big" | "Bloom" | "BottomSpike" | "Flash" | "Fly" | "Grass" | "Grow" | "GrowHollow" | "HeartSmallOutline" | "Heartline" | "HeartSmall" | "HeartSolid" | "HeartWings" | "In" | "Leaves" | "MidSpike" | "Ribow" | "Sense" | "Shake" | "SideHearts" | "Swim" | "Thorn" | "ThornOut" | "TopSpike" | "Venom" | "Viper" | "Waves" | "WingSmall";

export class WombTattoosModule extends BaseModule {
// 功能搭配 高潮余韵与失神 系统
    public Init(): void {

    }

    public Load(): void {

    }

    public Run(): void {
        // HookManager.setHook("ChatRoomMessage", 'getChatRoomMessageData', 10, (args) => {
        //     conDebug({
        //         name: 'getChatRoomMessageData',
        //         content: args
        //     });
        //     return {args: args}
        // })
    }

    public Unload(): void {

    }

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