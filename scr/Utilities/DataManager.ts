import { Data } from "../Base/Data"


export default class DataManager {
    private static private_data: Data<IData>;
    private static readonly onlineKeys: onlineKeys = ['version', 'hasWombTattoos', 'aftertaste'];
    private static readonly settingKeys: settingKeys = ['enabled'];
    private static readonly localKeys: localKeys = ['timestamp', 'version', 'hasWombTattoos', 'aftertaste', 'enabled'];

    public static Init() {
        DataManager.private_data = new Data({
            version: XSBE_VERSION,
            timestamp: CommonTime(),
            enabled: false as boolean,
            hasWombTattoos: false as boolean,
            aftertaste: 0
        }, this.onlineKeys, this.settingKeys, this.localKeys)

        window.XSBE_Data = DataManager.private_data
    }

    static get data() {
        return DataManager.private_data
    }
    static getCharacterData<T extends (Data<IData> | XSBE_SharedSettings)>(C: Character | PlayerCharacter): T | undefined {
        if (C.IsPlayer()) return this.data as T;
        else return C.OnlineSharedSettings?.XSBE as T;
    }
}