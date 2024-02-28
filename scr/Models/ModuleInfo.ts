export interface ModuleInfo {
    /**
     * 模块名
     */
    name: moduleName;
    priority: ModulePriority;
    description: string;
}

export type moduleName = 'base' | 'WombTattoosModule' | 'ArousalModule'

export enum ModulePriority {
    Bottom = -100,
    Observe = 0,
    AddBehavior = 1,
    ModifyBehavior = 5,
    OverrideBehavior = 10,
    Top = 100
}