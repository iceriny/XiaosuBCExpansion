import { DataBody } from "../../Base/Data"

/**
 * DataManager 类
 *
 * 该类提供了一个数据管理器，用于存储和操作游戏相关的核心数据。DataBody 类被用作私有静态成员变量来封装和同步不同来源（在线、设置、本地）的数据属性，并提供了获取与设置这些属性的方法。
 *
 * @export
 * @class DataManager
 */
export default class DataManager {
    /**
     * 私有静态成员变量，用于存储核心数据实体，包含 IDataBody 接口定义的所有属性
     */
    private static private_data: DataBody<IDataBody>;

    /**
     * 静态只读成员变量，包含需要从在线源同步的属性键名列表
     */
    private static readonly onlineKeys: onlineKeys = ['version', 'hasWombTattoos', 'aftertaste'];

    /**
     * 静态只读成员变量，包含需要从设置中获取的属性键名列表
     */
    private static readonly settingKeys: settingKeys = ['enabled'];

    /**
     * 静态只读成员变量，包含需要在本地持久化存储的属性键名列表
     */
    private static readonly localKeys: localKeys = [
        'timestamp', 
        'resistCount', 
        'aftertasteEffect', 
        'progress', 
        'version', 
        'hasWombTattoos', 
        'aftertaste', 
        'enabled'
    ];
     /**
     * 初始化方法，用于创建并初始化一个 DataBody 实例，并将其挂载到全局 window.XSBE_Data 上以便访问
     */
    public static Init() {
        DataManager.private_data = new DataBody({
            version: XSBE_VERSION,
            timestamp: 0,
            enabled: false as boolean,
            hasWombTattoos: false as boolean,
            aftertaste: 0,
            resistCount: 0,
            aftertasteEffect: new Set(),
            progress: 0,
        }, this.onlineKeys, this.settingKeys, this.localKeys)

        window.XSBE_Data = DataManager.private_data
    }

    /** 静态成员变量，用于获取 DataBody 实例 */
    static get data() {
        return DataManager.private_data
    }

    /**
     * 获取单条数据
     * @param name 需要获取的数据项名称
     */
    static get(name: keyof IDataBody) {
        this.private_data.get(name)
    }
    /**
     * 设置数据
     * @param key 设置的数据名
     * @param value 值
     * @param upload 是否更新到服务器 默认为 false
     * @param updateLocalTimestamp 是否更新本地的时间戳 默认为 true
     */
    static set<K extends keyof IDataBody>(key: K, value: IDataBody[K], upload: boolean = false, updateLocalTimestamp: boolean = true) {
        this.private_data.set(key, value, upload, updateLocalTimestamp)
    }
}