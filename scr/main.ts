import { hookFunction } from "./Utilities/BCSDK";
import { conDebug, DebugMSGType } from "./Utilities/Utilities";
import { HookManager } from "./Utilities/HookManager";

function initWait() {
    conDebug({
        name: "Start Init",
        type: DebugMSGType.Workflow_Log,
        content: "Init wait"
    });
    if (CurrentScreen == null || CurrentScreen === 'Login') {
        // 加载模组
        hookFunction('LoginResponse', 10, (args, next) => {
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
    HookManager.setHook('ChatRoomSync','Test HookManager', -1, (args) => {
        const a = args[0] as ServerChatRoomSyncMessage;
        conDebug({
            name: `HookManager Test`,
            content: a,
            type: DebugMSGType.Workflow_Log
        });
        HookManager.removeHook('ChatRoomSync','Test HookManager');
        return {
            args: args
        }
    })
}



initWait();
