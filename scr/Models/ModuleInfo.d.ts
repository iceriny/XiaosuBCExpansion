interface ModuleInfo {
    /**
     * 模块名
     */
    name: moduleName;
    priority: ModulePriority;
    description: string;
}

type moduleName = 'base' | 'WombTattoosModule' | 'ArousalModule'

type ModulePriority = -999 | 0 | 1 | 5 | 10 | 999
//  {
//     Bottom : -999,
//     Observe : 0,
//     AddBehavior : 1,
//     ModifyBehavior : 5,
//     OverrideBehavior: 10,
//     Top : 999
// }