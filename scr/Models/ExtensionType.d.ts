interface Window {
    XSBE_Data: unknown;
    XSBE_API?: {
        [key: string]: unknown;
    }
}

interface PlayerCharacter {
    XSBE?: XSBE_PlayerData
}

type XSBE_PlayerData = {
    [key: string]: unknown;
    version: string;
    timestamp: number;
    hasWombTattoos: boolean;
    aftertaste: number;
    Settings?: XSBE_Settings;
}
interface Character {
    OnlineSharedSettings?: CharacterOnlineSharedSettings
}

type XSBE_SharedSettings = {
    [key: string]: unknown
    version: string;
    hasWombTattoos: boolean;
    aftertaste: number;
}
interface CharacterOnlineSharedSettings {
    XSBE?: XSBE_SharedSettings
}

type XSBE_Settings = {
    enabled: boolean;
    [key: string]: unknown
}
type onlineKeys = ['version', 'hasWombTattoos', 'aftertaste'];
type settingKeys = ['enabled'];
type localKeys = ['timestamp', ...onlineKeys, ...settingKeys];

interface IData {
    version: string;
    timestamp: number;
    hasWombTattoos: boolean;
    aftertaste: number;
    enabled: boolean;
    [key: string]: unknown
}

/**
 * BCT的Arousal页面载入函数
 */
declare let PreferenceSubscreenBCTArousalLoad: (() => void) | undefined;
