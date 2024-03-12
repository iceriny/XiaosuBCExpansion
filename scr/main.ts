import { hookFunction } from "./Utilities/BCSDK";
import { conDebug, DebugMSGType } from "./Utilities/Utilities";
import DataManager from "./Utilities/Manager/DataManager";
import TimerProcessInjector from "./Utilities/Manager/TimerProcessInjector";
import ModulesLoader from "./Utilities/Modules/ModulesLoader";
import AssetManager from "./Utilities/Manager/AssetManager";
import PreferencePageManager from "./Utilities/Manager/PreferencePageManager";
// import { HookManager } from "./Utilities/HookManager";

function initWait() {
    conDebug({
        name: "Start Init",
        type: DebugMSGType.Workflow_Log,
        content: "Init wait"
    });
    if (CurrentScreen == null || CurrentScreen === 'Login') {
        // 加载模组
        hookFunction('LoginResponse', -999, (args, next) => {
            const result = next(args);
            conDebug({
                name: `Init! Login Response caught`,
                content: args,
                type: DebugMSGType.Workflow_Log
            });
            const response = args[0] as Character | string;
            if (response && typeof response === 'object' && typeof response.Name === 'string' && typeof response.AccountName === 'string') {
                init();
            }
            return result;
        });
    }
}

function init() {
    if (ModulesLoader.successfulLoaded) return;

    AssetManager.cacheAssets();
    
    // HookManager.setHook('ChatRoomSync', 'Test HookManager', -1, () => {
    //     testOverrideFunction();
    //     return
    // })


    // 数据处理
    DataManager.Init()
    conDebug({
        name: "Data Init Complete",
        type: DebugMSGType.Workflow_Log,
        content: DataManager.data
    });
    TimerProcessInjector.Init();

    ModulesLoader.registerModule();
    ModulesLoader.initModules();
    ModulesLoader.loadModules();
    ModulesLoader.runModules();

    TimerProcessInjector.Load();
    TimerProcessInjector.Run();

    PreferencePageManager.Init();
}



initWait();