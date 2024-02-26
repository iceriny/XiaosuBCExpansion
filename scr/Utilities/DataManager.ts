import { Data } from "../Base/Data"


export class DataManager {
    private static private_data: Data<IData>;

    public static Init() {
        DataManager.private_data = new Data({
            version: XSBE_VERSION,
            timestamp: CommonTime(),
            enabled: false as boolean,
            hasWombTattoos: false as boolean
        }, ['hasWombTattoos'], ['enabled'], ["version", "timestamp", "hasWombTattoos", "enabled"])

        window.XSBE_Data = DataManager.private_data
    }

    static get data() {
        return DataManager.private_data
    }
}