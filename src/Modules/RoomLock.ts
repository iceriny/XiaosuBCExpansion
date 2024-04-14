import BaseModule from "Base/BaseModule";
import DataManager from "Utilities/DataManager";
import HookManager from "Utilities/HookManager";
import MSGManager from "Utilities/MessageManager";
import TimerProcessInjector from "Utilities/TimerProcessInjector";

export default class RoomLockModule extends BaseModule {
    public Init(): void {}
    public Load(): void {
        this.getModuleData();
        CommandCombine({
            Tag: "unlockingroom",
            Description: "如果你被禁止离开了~ 用这个来解锁房间哦~",
            Action: (args, msg, parsed) => {
                if (parsed.length === 1) {
                    const SecretKey = msg.replace(/^\/unlockingroom\s+/, "");
                    const SecretKeyInfo = this.decryptSecretKeyInfo(SecretKey);
                    if (SecretKeyInfo) {
                        this.usedKey(SecretKeyInfo);
                    }
                }
            },
        });
    }
    public Unload(): void {}
    public Run(): void {
        this.HookList();
        // 处理本模块的TimerProcess
        this.TimerProcess();
    }

    private _locked: boolean = false;
    /** 是否禁止离开 */
    private set Locked(value: boolean) {
        this._locked = value;
        DataManager.set("roomLock", value, true, true);
    }
    private get Locked() {
        return this._locked;
    }
    private _timeToEndTime: number = -1;
    /** 秘钥剩余时间 */
    private set TimeToEndTime(value: number) {
        this._timeToEndTime = value;
        DataManager.set("roomLockTime", value, true, true);
    }
    private get TimeToEndTime() {
        return this._timeToEndTime;
    }

    private HookList() {
        // HookManager.setHook("ChatRoomCanLeave", "detectWhetherToLock", 999, (args) => {
        //     if (this.Locked) {
        //         return { args: args, result: false };
        //     }
        //     return;
        // });

        HookManager.patchAdd("ChatRoomMenuDraw", {
            "ChatRoomCanLeave() && ChatRoomIsLeavingSlowly()":
                "(ChatRoomCanLeave() && ChatRoomIsLeavingSlowly()) || Player.XSBE.roomLock",
        });
        HookManager.setHook("ChatRoomAttemptLeave", "TheRoomLocksToPreventLeavingTheRoom", 999, () => {
            if (this.Loaded) {
                MSGManager.SendLocalMessage("你被禁止离开。\n 求求你主人索要密码吧~", 5000);
                setTimeout(() => {
                    MSGManager.SendLocalMessage("哦对~ 如果你不知道如何解锁...", 5000);
                    setTimeout(() => {
                        MSGManager.SendLocalMessage("问问你主人吧~~", 5000);
                    }, 1000);
                }, 3000);
            }
        });

        HookManager.setHook("ChatRoomMessage", "LockedRoom", 0, (args) => {
            const msg = args[0] as ServerChatRoomMessage;
            if (msg.Type === "Whisper" && msg.Sender === Player.Ownership?.MemberNumber) {
                const match = msg.Content.match(/^@(禁止|允许)离开$/);
                if (match) {
                    switch (match[1]) {
                        case "允许":
                            this.Locked = false;
                            break;
                        case "禁止":
                            this.Locked = true;
                            break;
                    }
                }
            }
        });
    }
    private startPunishment = false;

    private penaltyInformationList = [
        `{source}脚趾一蜷一缩，难耐的交织.`,
        `{source}闭眼忍耐，鼻息中泄露出粉红的喘息.`,
        `{source}蜷缩脚趾忍耐着连续的快感.`,
        `{source}难耐的双腿颤抖着，身体的每一处都充满快感.`,
        `{source}拼命咬住牙齿，却从鼻腔泄露出诱人的声音.`,
        `{source}在汹涌的快感下浑身粉红，奋力的想要忍住高潮.`,
        `{source}浑身颤抖的抵抗高潮的逼近.`,
    ];
    private get PenaltyInformationList() {
        return this.penaltyInformationList[Math.floor(Math.random() * this.penaltyInformationList.length)];
    }

    private TimerProcess() {
        TimerProcessInjector.add(
            0,
            60000,
            () => {
                if (this.TimeToEndTime === -1) return false;
                return Date.now() > this.TimeToEndTime;
            },
            {
                name: "CheckIfTheKeyIsExpired",
                code: () => {
                    MSGManager.SendLocalMessage("秘钥过期了！30s后将开始惩罚! 请尽快离开当前房间!", 6000);
                    setTimeout(() => {
                        this.startPunishment = true;
                    }, 30000);
                },
            }
        );
        TimerProcessInjector.add(
            0,
            1000,
            () => {
                return this.startPunishment;
            },
            {
                name: "PunishmentOfSuperSecretKey",
                code: () => {
                    MSGManager.SendActivity(this.PenaltyInformationList, Player.MemberNumber!);
                },
            }
        );
    }

    /**
     * 加载模块数据
     */
    private getModuleData(): void {
        this._locked = DataManager.get("roomLock");
        this._timeToEndTime = DataManager.get("roomLockTime");
    }

    /**
     * 尝试解锁房间
     * @param key 秘钥
     */
    private usedKey(key: SecretKeyInfo) {
        const { result, iDPassed, startTimePassed, limitTimePassed } = this.isKeysAffirmed(key);
        if (result) {
            this.Locked = false;
            this.TimeToEndTime = key.startTime + key.limitTime;

            MSGManager.SendLocalMessage("解锁成功！", 5000);
            MSGManager.SendLocalMessage(`秘钥到期时间: ${this.formatTimestamp(this.TimeToEndTime)}`);
        } else {
            MSGManager.SendLocalMessage(
                `秘钥无法使用哦~\n原因: \n${iDPassed ? "" : "ID不匹配"} ${startTimePassed ? "" : "秘钥未到生效时间"} ${
                    limitTimePassed ? "" : "秘钥过期"
                }`,
                5000
            );
        }
    }

    /**
     * 将时间戳格式化为时刻字符串
     * @param timestamp 时间戳
     * @returns 时刻格式化后的字符串
     */
    private formatTimestamp(timestamp: number) {
        // 创建一个 Date 对象，并传入时间戳作为参数
        const date = new Date(timestamp);

        // 获取年、月、日、小时、分钟和秒
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从 0 开始，需要加 1，并且补零到两位数
        const day = date.getDate().toString().padStart(2, "0"); // 补零到两位数
        const hours = date.getHours().toString().padStart(2, "0"); // 补零到两位数
        const minutes = date.getMinutes().toString().padStart(2, "0"); // 补零到两位数
        const seconds = date.getSeconds().toString().padStart(2, "0"); // 补零到两位数

        // 将年、月、日、小时、分钟和秒拼接成日期时间字符串
        const formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

        return formattedDate;
    }

    /**
     * 检测秘钥是否可以使用
     * @param key 秘钥
     * @returns 秘钥在生效范围之内
     */
    private isKeysAffirmed(key: SecretKeyInfo): {
        result: boolean;
        iDPassed: boolean;
        startTimePassed: boolean;
        limitTimePassed: boolean;
    } {
        let iDPassed = false;
        let startTimePassed = false;
        let limitTimePassed = false;
        if (key.id === Player.Ownership?.MemberNumber) iDPassed = true;
        if (key.startTime <= Date.now()) startTimePassed = true;
        if (key.startTime + key.limitTime >= Date.now()) limitTimePassed = true;

        const result = iDPassed && startTimePassed && limitTimePassed;
        return { result, iDPassed, startTimePassed, limitTimePassed };
    }

    // VVV 加密解密函数与方法 VVV //

    /**
     *  用于加密的秘钥
     */
    private static readonly KEY = "bbf19967-af5d-4e85-8f3a-98afd8bde7a7";

    /**
     * 加密对象
     * @param SecretKeyInfo 需要加密的秘钥信息
     * @returns 返回加密后的字符串
     */
    private encryptSecretKeyInfo(SecretKeyInfo: SecretKeyInfo) {
        const unencryptedString = JSON.stringify(SecretKeyInfo);
        return this.encrypt(unencryptedString);
    }
    /**
     * 解密以获取秘钥对象
     * @param encryptedMessage 密文
     * @returns 解密后的秘钥对象
     */
    private decryptSecretKeyInfo(encryptedMessage: string) {
        const decryptedMessage = this.decrypt(encryptedMessage);
        const SecretKeyInfo = JSON.parse(decryptedMessage);
        if (this.isSecretKeyInfo(SecretKeyInfo)) {
            return SecretKeyInfo;
        } else {
            MSGManager.SendLocalMessage("秘钥解析失败，请确认是否正确", 5000);
            return null;
        }
    }

    private isSecretKeyInfo(variable: unknown): variable is SecretKeyInfo {
        // 检查变量是否为对象
        if (typeof variable !== "object" || variable === null) {
            return false;
        }
        // 检查变量是否具有所有必需的属性
        if (!("id" in variable && "startTime" in variable && "limitTime" in variable && "content" in variable))
            return false;

        // 检查变量是否具有所有必需的属性
        if (
            typeof variable.id !== "number" ||
            typeof variable.startTime !== "number" ||
            typeof variable.limitTime !== "number" ||
            typeof variable.content !== "string"
        ) {
            return false;
        }
        // 验证通过
        return true;
    }

    /**
     * 加密函数
     * @param message 要加密的信息
     * @returns 返回加密后的信息
     */
    private encrypt(message: string) {
        let midProduct = "";
        for (let i = 0; i < message.length; i++) {
            const charCode =
                (message.charCodeAt(i) + RoomLockModule.KEY.charCodeAt(i % RoomLockModule.KEY.length)) % 65536; // 支持 UTF-16 编码
            midProduct += String.fromCharCode(charCode);
        }

        const encryptedMessage = LZString.compressToBase64(midProduct);

        return encryptedMessage;
    }

    /**
     * 加密函数
     * @param encryptedMessage 密文
     * @returns 解密后的信息
     */
    private decrypt(encryptedMessage: string) {
        const msg = LZString.decompressFromBase64(encryptedMessage);
        if (!msg) return "";
        let decryptedMessage = "";
        for (let i = 0; i < msg.length; i++) {
            const charCode =
                (msg.charCodeAt(i) - RoomLockModule.KEY.charCodeAt(i % RoomLockModule.KEY.length) + 65536) % 65536; // 支持 UTF-16 编码
            decryptedMessage += String.fromCharCode(charCode);
        }
        return decryptedMessage;
    }
}