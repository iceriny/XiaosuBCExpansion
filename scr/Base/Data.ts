import { conDebug } from "../Utilities/Utilities";

/** @Mod的数据类 */
export type dataType = 'online' | 'setting' | 'local'

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

    private static readonly defaultCharacterOnlineSharedSettings: XSBE_SharedSettings = {
        version: '',
        hasWombTattoos: false,
        aftertaste: 0,
    }
    private static readonly defaultSetting: XSBE_Settings = {
        enabled: false
    }
    private static readonly defaultXSBE: XSBE_PlayerData = {
        version: '',
        timestamp: 0,
        hasWombTattoos: false,
        aftertaste: 0,
        Settings: this.defaultSetting,
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
            Player['XSBE'] = Data.defaultXSBE
        }
        if (!Player.OnlineSharedSettings?.XSBE) {
            Player.OnlineSharedSettings!['XSBE'] = Data.defaultCharacterOnlineSharedSettings
        }
        for (const k in this.data) {
            this.initSingleDataHandle(k, this.data[k])
        }

        if (ExtensionStorage()) {
            // 比对服务器数据和本地数据谁更新 并且使用更新的数据
            this.compareServerDataAndLocalDataAndUpdate();
        }
        this.updateExtensionSettings();
    }


    /**
     * 比较服务器数据和本地数据并更新
     */
    private compareServerDataAndLocalDataAndUpdate() {
        let ExtObj = this.getExtensionSettings()
        if (!ExtObj) ExtObj = {}
        // 获取服务器数据
        const serverExtensionSettingObject = ExtObj as Record<keyof T, T[keyof T]> | Record<string, never>;
        // 获取服务器数据的时间戳
        const serverTimestamp: number = (serverExtensionSettingObject['timestamp'] as number | undefined) ?? 0;
        // 获取本地数据的时间戳
        const localTimestamp: number = this.getDataFromLocalStorage('timestamp') ?? 0;

        if (serverExtensionSettingObject) {
            if (serverTimestamp > localTimestamp) {
                // 如果服务器数据的时间戳大于等于本地数据的时间戳，则更新更新内存数据
                for (const k in serverExtensionSettingObject) {
                    if (Object.hasOwnProperty.call(this.data, k)) {
                        if (k == 'version') continue; // 将来添加版本号的比对功能
                        const dataValue = this.data[k as keyof T];
                        const serverValue = serverExtensionSettingObject[k];
                        if (dataValue !== serverValue) {
                            this.set(k, serverValue)
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
    set<K extends keyof T>(key: K, value: T[K], dataType?: dataType, upload: boolean = false) {
        // 设置类内数据与数据类型标记
        this.data[key] = value;
        if (dataType) {
            switch (dataType) {
                case 'online':
                    this.onlineKeys.add(key);
                    this.localKeys.add(key);
                    break;
                case 'setting':
                    this.settingKeys.add(key);
                    this.localKeys.add(key);
                    break;
                case 'local':
                    this.localKeys.add(key);
                    break;
            }
        }

        // 设置Player中的数据
        // 表示是否是设置数据
        let isSettings = false;
        // 如果在本地key中
        if (this.localKeys.has(key)) {
            // 设置/更新本地空间中的数据
            localStorage.setItem(this.getLocalKeyFromKey(key), JSON.stringify(value));

            // 如果是设置数据 则把内容放入Player.XSBE的setting中
            if (this.settingKeys.has(key)) {
                Player.XSBE!.Settings![key as string] = value;
                isSettings = true;
            } else if (this.onlineKeys.has(key) && Player.OnlineSharedSettings) {
                // 如果是在线数据 则把内容放入Player.OnlineSharedSettings.XSBE中
                Player.OnlineSharedSettings.XSBE![key as string] = value
            }
            // 如果需要更新到服务器 则更新到服务器 换句话说是放入Player.ExtensionSettings中
            if (upload) this.updateExtensionSettings();
        }

        // 如果不是设置数据则放入Player.XSBE中
        if (!isSettings) Player.XSBE![key as string] = value;
    }




    private initSingleDataHandle<K extends keyof T>(key: K, value: T[K]) {
        let _value: T[K] = value;
        let updatePlayer = true;
        // 如果k为本地数据key
        if (this.localKeys.has(key)) {
            // 尝试获取本地数据
            const localValue = this.getDataFromLocalStorage(key)
            // 如果获取到 将获取到的值用于后续初始化
            if (localValue) {
                _value = localValue;
            }

            if (this.settingKeys.has(key)) {
                Player.XSBE!.Settings![key as string] = _value;
                updatePlayer = false;
            } else if (this.onlineKeys.has(key)) {

                if (!Player.OnlineSharedSettings?.XSBE?.[key as string]) {
                    Player.OnlineSharedSettings!.XSBE![key as string] = _value;
                } else {
                    _value = Player.OnlineSharedSettings.XSBE[key as string] as T[K];
                }
                // this.updateExtensionSettings();
            }
        }
        // set on Player
        if (key === 'timestamp') {
            _value = CommonTime() as T[K];
        }
        if (updatePlayer) Player.XSBE![key as string] = _value;
        this.data[key] = _value;
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

    // /**
    //  * 获取服务器数据并更新本地数据
    //  */
    // downloadExtensionSettings<K extends keyof T>() {
    //     const value = this.getExtensionSettings();
    //     if (ExtensionStorage() && value) {
    //         const ExtensionSettingsObject = value as Record<K, T[K]>;
    //         for (const key in ExtensionSettingsObject) {
    //             if (Object.hasOwnProperty.call(this.data, key)) {
    //                 this.set(key as K, ExtensionSettingsObject[key]);
    //             }
    //         }
    //     }
    // }

    /**
     * 获取服务器的ExtensionSettings字符串解压后返回为一个对象
     * @returns 返回从服务器获取到的数据的对象
     */
    getExtensionSettings() {
        let result;
        try {
            result = JSON.parse(LZString.decompressFromBase64(ExtensionStorage()) ?? '')
        } catch (error) {
            conDebug({
                name: 'Decompress ExtensionSettings Fail!!!  返回 null !!',
                content: error
            }, true);
            result = null;
        }
        return result as object | null;
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

    getDataFromLocalStorage<K extends keyof T>(key: K): T[K] | undefined {
        const value = localStorage.getItem(this.getLocalKeyFromKey(key)) as string;
        if (value) {
            return JSON.parse(value) as T[K];
        }
        return undefined;
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
