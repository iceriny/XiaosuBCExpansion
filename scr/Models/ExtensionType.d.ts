interface Window {
    XSBE_Data: unknown;
}

interface PlayerCharacter {
    XSBE?: {
        [key: string]: unknown;
        Settings?: {
            [key: string]: unknown;
        };
        OnlineData?: {
            [key: string]: unknown
        }
    }
}
type XSBE_SharedSettings = {[key: string] :unknown}
interface CharacterOnlineSharedSettings {
    XSBE?: XSBE_SharedSettings
}