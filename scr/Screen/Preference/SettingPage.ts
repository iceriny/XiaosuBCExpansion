import HookManager from "../../Utilities/HookManager";
// import DataManager from "../../Utilities/DataManager";
import AssetManager from "../../Utilities/AssetManager";
import { Position, GUI } from "../../Utilities/GUIManager";

export default class SettingPage {
    public static readonly SUBSCREEN = 'XSBEPreferenceRun'
    public static readonly MainButton: { position: Position } = { position: [1815, 175, 90, 90] }
    public static readonly ExitButton: { position: Position } = { position: [1815, 75, 90, 90] }


    static Init(): void {
        HookManager.setHook('PreferenceRun', 'DrawSettingButton', -50,
            () => {
                GUI.DrawButton(SettingPage.MainButton.position, "", "White", AssetManager.GetImgSrc('logo'));
                //DrawTextFit(TextGet("Homepage" + PreferenceSubscreenList[A]), 745 + 420 * Math.floor(A / 7), 205 + 110 * (A % 7), 310, "Black");
            });

        HookManager.setHook('PreferenceClick', 'MainPreferenceClick', -50,
            () => {
                if (GUI.MouseIn(this.MainButton.position)) PreferenceSubscreen = this.SUBSCREEN;
            })

        if (!window.PreferenceSubscreenXSBEPreferenceRun) window.PreferenceSubscreenXSBEPreferenceRun = this.RunSubscreen;
        if (!window.PreferenceSubscreenXSBEPreferenceClick) window.PreferenceSubscreenXSBEPreferenceClick = this.ClickSubscreen;

    }




    static PageLoad(): void {
    }

    static RunSubscreen(): void {
        GUI.DrawButton(this.ExitButton.position, "", "White", "Icons/Exit.png");
    }

    static ClickSubscreen(): void {

    }
}