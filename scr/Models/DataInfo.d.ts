// export interface IData {
//     modData: ModData;
//     characterData: CharacterData;
//     onlineData: OnlineData;
//     extensionData: ExtensionData;
//     settingData: SettingData;
//     localData: LocalData;
// }
// export type AllData = ModData | CharacterData | OnlineData | ExtensionData | SettingData | LocalData;
// export type ModData = Map<modDataKey, unknown>
// export type CharacterData = Map<characterDataKey, unknown>
// export type OnlineData = Map<onlineDataKey, unknown>
// export type ExtensionData = string
// export type SettingData = Map<settingDataKey, unknown>
// export type LocalData = Map<localDataKey, unknown>

// // 从 ModData 类型中提取键类型
// export type GetModDataKeyType<T extends Exclude<AllData, ExtensionData>> = T extends Map<infer K, unknown> ? K : never;

// export type DataKey = keyof IData;

// export type DataName = modDataKey | characterDataKey | onlineDataKey | extensionDataKey | settingDataKey | localDataKey

// export type modDataKey = 'version' | 'loaded'
// export interface modDataItem {
//     version: string;
//     loaded: unknown;
// }

// export type characterDataKey = 'haveWombTattoos' | 'wombTattoosEffect'

// export type onlineDataKey = ''

// export type extensionDataKey = 'extensionData'

// export type settingDataKey = ''

// export type localDataKey = ''

interface IData {
    version: string;
    timestamp: number;
    enabled: boolean;
    hasWombTattoos: boolean;
    aftertaste:number;
    [key: string]: unknown
}

// 定义每种dataType对应的键类型
interface DataKeys {
    modData: 'version' | 'loaded';
    characterData: 'haveWombTattoos' | 'wombTattoosEffect';
    settingData: 'settingKey1' | 'settingKey2';
    onlineData: 'onlineKey1' | 'onlineKey2';
    // 对于非Map类型的数据，使用never类型，因为它们不接受entryKey参数
    //extensionData: never;
    localData: 'localKey1' | 'localKey2';
}

interface DataMap {
    modData: Map<DataKeys['modData'], unknown>;
    characterData: Map<DataKeys['characterData'], unknown>;
    settingData: Map<DataKeys['settingData'], unknown>;
    onlineData: Map<DataKeys['onlineData'], unknown>;
    //extensionData: string;
    localData: Map<DataKeys['localData'], unknown>;
}