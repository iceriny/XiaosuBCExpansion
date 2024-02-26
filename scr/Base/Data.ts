/** @Mod的数据类 */
type dataType = 'online' | 'setting' | 'local'

export const PlayerStorage = () => Player?.XSBE;
export const PlayerOnlineSharedSettingsStorage = () => Player.OnlineSharedSettings?.XSBE;
export const ExtensionStorage = () => Player.ExtensionSettings?.XSBE as string;
/**
 * mod所使用的数据的类
 */
export class Data<T extends IData> {
    private prefix: string = "XSBE_";
    /** 在线分享数据的key集合 */
    private onlineKeys: Set<keyof T>;
    /** 设置数据的key集合 */
    private settingKeys: Set<keyof T>;
    /** 本地数据的key集合 */
    private localKeys: Set<keyof T>;

    private static readonly defaultData = {
        XSBE: {
            Settings: {},
            OnlineData: {}
        },
        CharacterOnlineSharedSettings: {
            XSBE: {}
        }
    }
    /**
     * 创建数据类
     * @param data 以此为模板创建数据
     * @param onlineKeys 数据中哪些键是在线分享数据
     * @param settingKeys 数据中哪些键是设置键
     * @param localKeys 数据中哪些键是本地数据键
     */
    constructor(private data: T, onlineKeys: (keyof T)[], settingKeys: (keyof T)[], localKeys: (keyof T)[]) {
        this.onlineKeys = new Set(onlineKeys);
        this.settingKeys = new Set(settingKeys);
        this.localKeys = new Set(localKeys);
        if (!Player.XSBE) {
            Player['XSBE'] = Data.defaultData.XSBE
        }
        if (!Player.OnlineSharedSettings?.XSBE) {
            Player.OnlineSharedSettings!['XSBE'] = Data.defaultData.CharacterOnlineSharedSettings.XSBE
        }
        for (const k in this.data) {
            this.dataSetHandle(k, this.data[k], false)
        }

        if (ExtensionStorage()) {
            // 比对服务器数据和本地数据谁更新
            this.compareServerDataAndLocalDataAndUpdate();
        } else {
            this.updateExtensionSettings();
        }

    }


    /**
     * 比较服务器数据和本地数据并更新
     */
    private compareServerDataAndLocalDataAndUpdate() {
        // 获取服务器数据
        const serverExtensionSettingObject = this.getExtensionSettings() as Record<keyof T, T[keyof T]> | Record<string, never>;
        // 获取服务器数据的时间戳
        const serverTimestamp: number = (serverExtensionSettingObject['timestamp'] as number | undefined) ?? 0;
        // 获取本地数据
        const localDataObject = this.getLocalStorage() as Record<keyof T, T[keyof T]>;
        // 获取本地数据的时间戳
        const localTimestamp: number = (localDataObject['timestamp'] as number | undefined) ?? 0;

        if (serverExtensionSettingObject) {
            if (serverTimestamp >= localTimestamp) {
                // 如果服务器数据的时间戳大于等于本地数据的时间戳，则更新更新内存数据
                for (const k in serverExtensionSettingObject) {
                    if (Object.hasOwnProperty.call(this.data, k)) {
                        if (k == 'version') continue; // 将来添加版本号的比对功能
                        const dataValue = this.data[k as keyof T];
                        const serverValue = serverExtensionSettingObject[k];
                        if (dataValue !== serverValue) {
                            this.data[k as keyof T] = serverValue;
                        }
                    }
                }
            } else {
                // 如果本地数据的时间戳大于服务器数据的时间戳，则使用本地数据更新内存数据
                for (const k in localDataObject) {
                    if (Object.hasOwnProperty.call(this.data, k)) {
                        if (k == 'version') continue;// 将来添加版本号的比对功能
                        const dataValue = this.data[k as keyof T];
                        const localValue = localDataObject[k];
                        if (dataValue !== localValue) {
                            this.data[k as keyof T] = localValue;
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取数据
     * 因为在set时同步了数据到Player.XSBE中 所以这里获取到的应该和Player中的一致
     * @param key key值
     * @returns 获取到的数据
     */
    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    /**
     * 设置数据 同步到Player中 可选的同步到服务器
     * @param key 设置数据的键
     * @param value 设置数据的值
     * @param upload 是否同步到服务器
     */
    set<K extends keyof T>(key: K, value: T[K],dataType?: dataType[], upload: boolean = false) {
        this.data[key] = value;
        if (dataType){
            for (const t of dataType){
                switch (t){
                    case 'online':
                        this.onlineKeys.add(key);
                        break;
                    case 'setting':
                        this.settingKeys.add(key);
                        break;
                    case 'local':
                        this.localKeys.add(key);
                        break;
                }
            }
        }
        this.dataSetHandle(key, value, upload);
    }



    /**
     * 处理数据 this.data 与 Player和服务器 之间的同步
     * @param key 设置的数据的键
     * @param value 设置数据的值
     * @param upload 是否同步到服务器
     */
    private dataSetHandle<K extends keyof T>(key: K, value: T[K], upload: boolean) {
        if (this.localKeys.has(key)) {
            localStorage.setItem(this.getLocalKeyFromKey(key), JSON.stringify(value));
            if (this.settingKeys.has(key)) {
                Player.XSBE!.Settings![key as string] = value;
            } else if (upload) {
                if (Player.OnlineSharedSettings && this.onlineKeys.has(key)) Player.OnlineSharedSettings!.XSBE![key as string] = value;
                this.updateExtensionSettings();
            } else {
                // set on Player
                Player.XSBE![key as string] = value;
            }
        } else {
            // set on Player
            Player.XSBE![key as string] = value;
        }
    }

    /**
     * 更新ExtensionSettings到服务器
     */
    updateExtensionSettings() {
        // 创建一个新对象，用于存储满足条件的键值对
        const ExtensionSettingsObject: T = {} as T;
        // 使用循环遍历原始对象的键值对
        for (const key in this.data) {
            if (Object.hasOwnProperty.call(this.data, key)) {
                if (this.localKeys.has(key)) {
                    // 将满足条件的键值对添加到新对象中
                    ExtensionSettingsObject[key] = this.data[key];
                }
            }
        }
        if (!ExtensionStorage()) {
            Player.ExtensionSettings.XSBE = ''
        }
        Player.ExtensionSettings.XSBE = LZString.compressToBase64(JSON.stringify(ExtensionSettingsObject));
        ServerPlayerExtensionSettingsSync('XSBE');
    }

    /**
     * 获取服务器数据并更新本地数据
     */
    downloadExtensionSettings<K extends keyof T>() {
        if (ExtensionStorage()) {
            const ExtensionSettingsObject = this.getExtensionSettings() as Record<K, T[K]>;
            for (const key in ExtensionSettingsObject) {
                if (Object.hasOwnProperty.call(this.data, key)) {
                    this.set(key as K, ExtensionSettingsObject[key]);
                }
            }
        }
    }

    /**
     * 获取服务器的ExtensionSettings字符串解压后返回为一个对象
     * @returns 返回从服务器获取到的数据的对象
     */
    getExtensionSettings() {
        return JSON.parse(LZString.decompressFromBase64(ExtensionStorage()) ?? '') as object;
    }

    /**
     * 获取从本地储存空间获取到的数据对象
     * @returns 返回从本地空间获取到的数据对象
     */
    getLocalStorage<K extends keyof T>(): object {
        const localStorageObject = {};
        for (const k of this.localKeys) {
            const value = localStorage.getItem(this.getLocalKeyFromKey(k)) as string;
            if (value) {
                (localStorageObject as Record<K, T[K]>)[k as K] = JSON.parse(value) as T[K];
            }
        }
        return localStorageObject;
    }

    /**
     * 通过输入的Key值获取到本地空间的key键
     * @param key key
     * @returns 本地空间的键
     */
    getLocalKeyFromKey(key: keyof T): string {
        return `${this.prefix}${key as string}`;
    }

}
