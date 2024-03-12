import * as SettingsType from "../Models/Settings";
export default abstract class SettingBase<T extends Map<string, unknown>> {
    protected abstract values: T;
    protected abstract description: string;
    protected abstract type: SettingsType.settingType;
    protected abstract module: moduleName | null;

    public abstract getSetting<K extends keyof T>(key: K): T[K];

    constructor(module: moduleName, type: SettingsType.settingType) {
        this.Init(module, type);
    }


    public Init(module: moduleName, type: SettingsType.settingType): void {
        this.values = new Map<string, unknown>() as T;
        this.type = type;
        if (type === 'Global') this.module = null;
        else this.module = module;
    }
    public load(): void {
    }
}