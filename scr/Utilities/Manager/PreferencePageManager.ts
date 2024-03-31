import HookManager from "./HookManager";
// import DataManager from "../../Utilities/DataManager";
import AssetManager from "./AssetManager";
import GUITool from "../GUITool";
import MainPage from "../../Screen/Preference/MainPage";


export default class PreferencePageManager {
    static SettingButtonPosition: SCRLocation = [1815, 175, 90, 90];
    static mainPage: MainPage | undefined;


    static Init() {
        HookManager.setHook('PreferenceLoad', 'PreferencePageLoad', -50,()=>{
            this.Load();
        });
        HookManager.setHook('PreferenceRun', 'DrawSettingButton', -50,
            () => {
                if (PreferenceSubscreen === '') GUITool.DrawButton(PreferencePageManager.SettingButtonPosition,
                    "",
                    "White",
                    AssetManager.GetImgSrc('logo'));
            });

        HookManager.setHook('PreferenceClick', 'MainPreferenceClick', -50,
            () => {
                if (GUITool.MouseIn(PreferencePageManager.SettingButtonPosition) && this.mainPage){
                    this.mainPage.PageLoad();
                }
            })
        HookManager.setHook('InformationSheetExit', 'UnloadPreferencePage', -50,
            () => {
                if (this.mainPage) {
                    this.Unload();
                }
            })
    }

    private static Load() {
        this.mainPage = new MainPage(null);
        this.mainPage.Init();
    }
    private static Unload() {
        if (!this.mainPage) return;

        for (const page of this.mainPage.getAllSubPages()){
            delete window[`PreferenceSubscreen${page.Name}Run`];
            delete window[`PreferenceSubscreen${page.Name}Click`];
        }
        this.mainPage = undefined;
    }
}

