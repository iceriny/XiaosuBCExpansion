import DataManager from "../Utilities/Manager/DataManager";

export default class Settings {
    protected Settings: Map<settingKeys[number], unknown>;
    protected readonly settingKeys: Set<settingKeys[number]>;

    constructor(...settingKeys: (settingKeys[number])[]) {
        this.settingKeys = new Set(settingKeys);
        this.Settings = new Map<settingKeys[number], unknown>();
        this.Load();
    }

    protected Load(): void {
        for (const s of this.settingKeys){
            const value = DataManager.get(s as unknown as keyof IDataBody)
            this.Settings.set(s, value)
        }
    }

    protected Save<T extends keyof IDataBody>(): void {
        this.Settings.forEach((s, k) => DataManager.set(k as unknown as T, s as IDataBody[T], true, true))
    }
}