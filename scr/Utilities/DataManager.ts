import { Data } from "../Base/Data"


export class DataManager {
    private static private_data: Data<IData>;

    public static Init() {
        DataManager.private_data = new Data({
            version: XSBE_VERSION,
            timestamp: CommonTime(),
            enabled: false as boolean,
            hasWombTattoos: false as boolean,
            aftertaste: 0
        }, ['hasWombTattoos', 'aftertaste'], ['enabled'], ["version", "timestamp", "hasWombTattoos", "enabled", "aftertaste"])

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