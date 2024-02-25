import { Data } from "../Base/Data"


export class DataManager {
    static data: Data<IData>;

    Init() {
        DataManager.data = new Data({
            version: '',
            timestamp: CommonTime(),
            enabled: false as boolean,
            hasWombTattoos: false as boolean
        }, ['hasWombTattoos'], ['enabled'], ["version", "timestamp", "hasWombTattoos", "enabled"])

        window.XSBE_Data = DataManager.data
    }

    getData = (): Data<IData> => DataManager.data;

}