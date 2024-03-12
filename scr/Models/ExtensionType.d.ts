interface Window {
    XSBE_Data: unknown;
    XSBE_API?: {
        [key: string]: unknown;
    };
    [key: string]: ()=>void;
}

interface PlayerCharacter {
    XSBE?: XSBE_PlayerData,
    BCT?: BCTData,

    // BCT
    BCEArousal?: boolean,
    BCEArousalProgress?:number
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
type localKeys = ['timestamp', 'resistCount', 'aftertasteEffect', 'progress', ...onlineKeys, ...settingKeys];

// type ArousalSettings = 

interface IDataBody {
    version: string;
    timestamp: number;
    hasWombTattoos: boolean;
    aftertaste: number;
    enabled: boolean;
    resistCount: number;
    progress: number;
    aftertasteEffect: Set<AftertasteEffect>;
}

type AftertasteEffect = 'relax' | 'weakness' | 'twitch' | 'trance' | 'absentminded'


///  VVVVVVVVVVV   BCT!!!   VVVVVVVVVVVV
/**
 * BCT的Arousal页面载入函数
 */
declare let PreferenceSubscreenBCTArousalLoad: (() => void) | undefined;

declare let PreferenceSubscreenBCTArousalClick: (() => void) | undefined;

declare let PreferenceSubscreenBCTArousalRun: (() => void) | undefined

declare const BCT_API: {
    HintForeColor: "Black",
    HintBackColor: "Yellow",
    HintBorderColor: "Black",
    ActivityChatRoomBCTArousalSync: (C: Character) => void,
    ActivitySetBCTArousal: (C: Character, Progress: number) => void,
    getOrgasmProgressMultiplier: (C: Character) => void,
    tailWag: () => void
};
interface BCTData {
    "version": string,
    "bctSettings": {
        "splitOrgasmArousal": boolean,
        "arousalbarLocation": "Bottom" | "Right",
        "arousalProgressMultiplier": string,
        "arousalDecayMultiplier": string,
        "orgasmProgressMultiplier": string,
        "orgasmDecayMultiplier": string,
        "arousalAffectsOrgasmProgress": boolean,
        "arousalAffectsErection": boolean,
        "automaticErectionThreshold": string,
        "tailWaggingEnable": boolean,
        "tailWaggingTailOneName": string,
        "tailWaggingTailOneColor": string,
        "tailWaggingTailTwoName": string,
        "tailWaggingTailTwoColor": string,
        "tailWaggingDelay": number,
        "tailWaggingCount": number,
        "bestFriendsEnabled": boolean,
        "bestFriendsRoomShare": boolean,
        "bestFriendsList": [],
        "miscShareRoomList": [],
        "hsToBFLockconvert": boolean,
        "ItemPerm": {
            "Best Friend Padlock": number,
            "Best Friend Timer Padlock": number
        },
        "allIconOnlyShowOnHover": boolean,
        "bctIconOnlyShowOnHover": boolean,
        "showChangelog": boolean,
        "version": number
    },
    "bctSharedSettings": {
        "splitOrgasmArousal": boolean,
        "arousalProgressMultiplier": string,
        "arousalDecayMultiplier": string,
        "orgasmProgressMultiplier": string,
        "orgasmDecayMultiplier": string,
        "arousalAffectsOrgasmProgress": boolean,
        "bestFriendsEnabled": boolean
    },
    "splitOrgasmArousal": {
        "arousalProgress": number,
        "arousalZoom": boolean,
        "ProgressTimer": number,
        "vibrationLevel": number,
        "changeTime": number
    }
}