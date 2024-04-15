import { DataBody } from "../Base/Data";

export default class DataManager {
    private static private_data: DataBody<IDataBody>;
    private static readonly onlineKeys: onlineKeys = [
        "version",
        "hasWombTattoos",
        "aftertaste"
    ];
    private static readonly settingKeys: settingKeys = ["enabled"];
    private static readonly localKeys: localKeys = [
        "timestamp",
        "resistCount",
        "aftertasteEffect",
        "progress",
        "roomLock",
        "roomLockTime",
        "roomLockRoomName",
        "version",
        "hasWombTattoos",
        "aftertaste",
        "enabled",
    ];

    public static Init() {
        DataManager.private_data = new DataBody(
            {
                version: XSBE_VERSION,
                timestamp: 0,
                enabled: false as boolean,
                hasWombTattoos: false as boolean,
                aftertaste: 0,
                resistCount: 0,
                aftertasteEffect: new Set(),
                progress: 0,
                roomLock: false as boolean,
                roomLockTime: -1,
                roomLockRoomName: "",
            },
            this.onlineKeys,
            this.settingKeys,
            this.localKeys
        );

        window.XSBE_Data = DataManager.private_data;
    }

    static get data() {
        return DataManager.private_data;
    }

    static get<K extends keyof IDataBody>(name: K) {
        return this.private_data.get(name);
    }
    static set<K extends keyof IDataBody>(
        key: K,
        value: IDataBody[K],
        upload: boolean = false,
        updateLocalTimestamp: boolean = true
    ) {
        this.private_data.set(key, value, upload, updateLocalTimestamp);
    }
}
