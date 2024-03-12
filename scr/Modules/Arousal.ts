import BaseModule from "../Base/BaseModule";
import AssetManager from "../Utilities/Manager/AssetManager";
import DataManager from "../Utilities/Manager/DataManager";
import HookManager from "../Utilities/Manager/HookManager";
import MSGManager, { PH } from "../Utilities/Manager/MessageManager";
import TimerProcessInjector from "../Utilities/Manager/TimerProcessInjector";
import { SetSkillModifier, conDebug, getDynamicProbability, getMoan, segmentForCH } from "../Utilities/Utilities";


export default class ArousalModule extends BaseModule {
    private _aftertaste: number = 0;
    private static readonly MAX_AFTERTASTE = 120;
    /** 对于忍耐高潮时的反应描述 */
    private descriptionOfEnduranceActivities = [
        `{source}脚趾一蜷一缩，难耐的交织.`,
        `{source}闭眼忍耐，鼻息中泄露出粉红的喘息.`,
        `{source}蜷缩脚趾忍耐着连续的快感.`,
        `{source}难耐的双腿颤抖着，身体的每一处都充满快感.`,
        `{source}拼命咬住牙齿，却从鼻腔泄露出诱人的声音.`,
        `{source}在汹涌的快感下浑身粉红，奋力的想要忍住高潮.`,
        `{source}浑身颤抖的抵抗高潮的逼近.`
    ];

    private needSendEnduringMessage = false;

    /** 获取忍耐高潮时的反应描述 */
    get getEndureDesc(): string {
        return this.descriptionOfEnduranceActivities[Math.floor(Math.random() * this.descriptionOfEnduranceActivities.length)];
    }
    public Run(): void {
        // 处理本模块的Hook函数
        this.HookList();
        // 处理本模块的Patch函数
        this.patchListHandler();
        // 处理本模块的TimerProcess
        this.TimerProcess();

    }
    public Unload(): void { }
    public Init(): void { }
    public Load(): void {
        // 取出数据到类内
        this._aftertaste = DataManager.data.get('aftertaste') ?? 0;

        // 尝试同步进度
        const dataProgress = Math.floor(DataManager.data.get('progress'));
        Player.ArousalSettings!.Progress = dataProgress;
        // if (Player.BCT) {
        //     Player.BCT.splitOrgasmArousal.arousalProgress = dataProgress;
        // }
        if (Player.BCEArousal) Player.BCEArousalProgress = dataProgress;
        // setTimeout(() => {
        //     BCT_API.ActivityChatRoomBCTArousalSync(Player);
        // }, 1200);
    }

    //public getArousalSettings = (C: Character | PlayerCharacter): ArousalSettingsType | undefined => C.ArousalSettings;

    //public getOrgasmStage = (C: Character | PlayerCharacter): number => this.getArousalSettings(C)?.OrgasmStage ?? 0;

    public set Aftertaste(level: number) {
        DataManager.set('aftertaste', level, true);
        this._aftertaste = level;
    }
    public get Aftertaste() {
        return this._aftertaste;
    }

    /**
     * 处理本模块的Hook函数
     */
    private HookList(): void {
        // 处理高潮余韵等级的增加
        HookManager.setHook('ActivityOrgasmStart', 'AftertasteSet', 2, (args) => {
            if (!(args[0] as Character).IsPlayer()) return;

            const addedNumber = ActivityOrgasmGameResistCount + 1;
            this.Aftertaste = this._aftertaste + addedNumber;
            if (this._aftertaste > ArousalModule.MAX_AFTERTASTE) this.Aftertaste = ArousalModule.MAX_AFTERTASTE;
            this.AftertasteEffectSetHandler(true);
        });
        // 处理同步ActivityOrgasmGameResistCount到player
        HookManager.setHook('ActivityOrgasmStart', 'ResistCountSync', -2, (args) => {
            if ((args[0] as Character).IsPlayer()) DataManager.set('resistCount', ActivityOrgasmGameResistCount, true);
        });

        // 在进入聊天室时处理 余韵等级 高潮抵抗 初始化
        HookManager.setHook('ChatRoomSync', 'EnterChatRoomInitData', -10, () => {
            this.AftertasteEffectSetHandler(false);
            ActivityOrgasmGameResistCount = DataManager.data.get('resistCount')
        });

        // 将进度信息同步到Mod
        HookManager.setHook('ActivityChatRoomArousalSync', 'ArousalToDataSync', -10, () => {
            DataManager.set('progress', Player.ArousalSettings!.Progress);
        });

        // 处理对慢速移动
        HookManager.setHook('Player.GetSlowLevel', 'aftertasteWeaknessEffect', -9, (args, lastResult) => {
            if (Player.RestrictionSettings?.SlowImmunity)
                return { args: args, result: 0 };
            let result = lastResult;
            if (typeof result === 'number' && this.afterEffectSwitch.weakness) {
                let slowLevel = 1;
                if (this._aftertaste > 55) slowLevel++;
                if (this._aftertaste > 60) slowLevel++;
                if (this._aftertaste > 70) slowLevel++;
                if (result < slowLevel) result = slowLevel;
                else result++;
            }
            return { args, result }
        });

        // 处理余韵对失明等级的增加
        HookManager.setHook('Player.GetBlindLevel', 'aftertasteEffectAboutBlindLevel', -10, (args, lastResult) => {
            let result = lastResult;
            if (typeof result === 'number' && this.afterEffectSwitch.weakness) {
                let blindLevel = 1;
                if (this.afterEffectSwitch.twitch) blindLevel++;
                if (this.afterEffectSwitch.trance) blindLevel++;
                if (this.afterEffectSwitch.absentminded) blindLevel++;
                if (result < blindLevel) result = blindLevel;
                else result++;
            }
            return { args, result }
        });

        // 处理余韵对是否能够跪下的影响 这个函数返回false时不代表按钮不能按 只是表示不能直接切换为跪下站起  需要进行游戏
        HookManager.setHook('Player.CanKneel', 'aftertasteEffectAboutCanKneel', 9, (args) => {
            if (this.afterEffectSwitch.weakness) {
                return { args, result: false }
            }
            return
        });

        // 处理余韵对听觉的限制
        HookManager.setHook('Player.GetDeafLevel', 'aftertasteEffectAboutDeafLevel', -11, (args, lastResult) => {
            let result = lastResult;
            if (typeof result === 'number' && this.afterEffectSwitch.trance) {
                let deafLevel = 1;
                if (this.afterEffectSwitch.absentminded) deafLevel++;
                if (result < deafLevel) result = deafLevel;
                else result++;
            }
            return { args, result }
        })

        // 处理余韵对身体姿势的限制
        HookManager.setHook('PoseAvailable', 'aftertasteEffectAboutPose', 3, (args) => {
            const P = args[0] as Character;
            if (P.IsPlayer() && this.afterEffectSwitch.twitch) {
                return { args, result: false };
            }
            return;
        });

        // 处理余韵不能离开房间
        HookManager.setHook('ChatRoomCanLeave', 'aftertasteEffectAboutCanLeave', 10, (args) => {
            if (this.afterEffectSwitch.absentminded) return { args, result: false };
            return;
        });

        // 处理余韵对发送消息的限制
        HookManager.setHook('CommandParse', 'aftertasteEffectAboutChat', 10, (args) => {
            if (this.afterEffectSwitch.relax) {
                let msg = args[0] as string;
                const firstChar = msg.charAt(0);
                if (firstChar !== '*' && firstChar !== CommandsKey && firstChar !== '.' && firstChar !== '@' && firstChar !== '`' && firstChar !== '!') {
                    const segmentList = segmentForCH(msg)
                    if (segmentList === null) {
                        conDebug('程序正在处理 消息分词，但您的浏览器不支持该功能!!! 无法显示余韵的特殊字符串加工效果。')
                    } else {
                        let cacheStr = '';
                        for (let i = 0; i < segmentList.length; i++) {
                            const subStr = segmentList[i];
                            if (i === 0) cacheStr = subStr;
                            else {
                                cacheStr += this.msgSubStringHandle(subStr)
                            }
                        }
                        msg = cacheStr;
                    }
                    (args[0] as string) = '*'.concat(msg).concat('....^(虚弱)');
                }
            }
            return { args };
        });
    }
    /**
     * 处理消息中经过分词后的子字符串的显示效果
     * 使用动态概率影响效果 概率分布符合 logistic 函数
     * 简单来说 当余韵等级越高时 越容易出现屏蔽单词
     * 等级越低时 越容易出现呻吟和口吃
     * @param subStr 传入的子字符串
     * @returns 处理后的字符串
     */
    private msgSubStringHandle(subStr: string): string {
        // 获取三个概率判断结果
        const probability_bold = Math.random() < getDynamicProbability(this._aftertaste, 0, ArousalModule.MAX_AFTERTASTE, 0.2, 0.8);
        const probability_moan = Math.random() < getDynamicProbability(this._aftertaste, 0, ArousalModule.MAX_AFTERTASTE, 0.1, 0, true);
        const probability_negative = Math.random() < getDynamicProbability(this._aftertaste, 0, ArousalModule.MAX_AFTERTASTE, 0.05, -0.02, true);

        let formattedSubStr = subStr;

        if (probability_bold) {
            formattedSubStr = `..${'*'.repeat(subStr.length)}..`;
        }

        if (probability_moan) {
            formattedSubStr += `${getMoan()}...`;
        }

        if (probability_negative) {
            formattedSubStr += `-${formattedSubStr}`;
        }

        return formattedSubStr;
    }

    /**
     * 处理本模块的TimerProcess
     */
    private TimerProcess(): void {
        // 处理边缘增加抵抗高潮难度
        TimerProcessInjector.add(101, 45000, () => {
            return !!Player.ArousalSettings
        }, {
            code: () => {
                if (Player.ArousalSettings!.Progress >= 93) {
                    ActivityOrgasmGameResistCount++;
                    DataManager.set('resistCount', ActivityOrgasmGameResistCount, true)
                } else if (Player.ArousalSettings!.Progress < 60 && ActivityOrgasmGameResistCount >= 1) {
                    ActivityOrgasmGameResistCount--;
                    DataManager.set('resistCount', ActivityOrgasmGameResistCount, true)
                }
            },
            name: "EdgeTimer"
        });

        // 处理高潮余韵的恢复 每15秒回复一次与当前高潮抵抗等级有关
        TimerProcessInjector.add(100, 15000, () => {
            return this._aftertaste > 0;
        }, {
            code: () => {
                this.AftertasteFallBack();
                this.AftertasteEffectSetHandler(true);
            },
            name: "AftertasteFallBack"
        });

        // 处理高潮余韵的无力效果
        TimerProcessInjector.add(99, 0, () => {
            return this._aftertaste >= 20;
        }, {
            code: () => {
                if (this._aftertasteEffectSet.has('relax') && SkillGetModifier(Player, 'Bondage') >= 0) {
                    SetSkillModifier('Bondage', 0.4, 5000);
                    SetSkillModifier('SelfBondage', 0.4, 5000);
                    SetSkillModifier('LockPicking', 0.4, 5000);
                    SetSkillModifier('Evasion', 0.1, 5000);
                    SetSkillModifier('Willpower', 0.8, 5000);
                    SetSkillModifier('Infiltration', 0.2, 5000);
                    SetSkillModifier('Dressage', 0.2, 5000);
                }
            },
            name: "AftertasteEffectHandle"
        });

        // 处理是否需要禁用输入
        TimerProcessInjector.add(-1, 200, () => {
            return CurrentScreen == "ChatRoom" && Player.MemberNumber !== undefined;
        }, {
            code: () => {
                // 高潮时的禁用
                const orgasmStage = Player.ArousalSettings?.OrgasmStage;
                if (orgasmStage == 1) {
                    this.needSendEnduringMessage = true;
                    if (!this.inputDisabled) {
                        this.DisableInput(true);
                    }
                } else if (orgasmStage == 0) {
                    this.needSendEnduringMessage = false;
                    if (this.inputDisabled) {
                        this.DisableInput(false);
                    }
                } else if (orgasmStage == 2) {
                    this.needSendEnduringMessage = false;
                }
            },
            name: "DisableInput"
        });

        // 处理是否需要发送忍耐的描述
        TimerProcessInjector.add(-2, 2500, () => {
            return this.needSendEnduringMessage;
        }, {
            code: () => {
                MSGManager.SendActivity(this.getEndureDesc, Player.MemberNumber!);
            },
            name: 'SendEnduringMessage'
        });

    }


    /**
     * 补丁列表处理
     */
    private patchListHandler(): void {
        // 处理OrgasmStart
        HookManager.patchAdd("ActivityOrgasmStart",
            {// XSA补丁处理~ 基础高潮时间为 4~7秒, 每边缘45秒钟增加随机的 300ms ~ 1300ms 的高潮时间。 最多增加 20000ms，也就是最长高潮时间为 27 秒
                "C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;":
                    `if (Player.XSBE && C.IsPlayer()) {
                const addedTime = (Math.random() + 0.3) * 1000 * ActivityOrgasmGameResistCount;
                C.ArousalSettings.OrgasmTimer = CurrentTime + (addedTime > 20000 ? 20000 : addedTime) + 4000 + (3000 * Math.random());
            } else {
                C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
            }`,
                // 高潮时将抵抗难度减半而非变为0
                "ActivityOrgasmGameResistCount = 0;":
                    "ActivityOrgasmGameResistCount = Math.round(ActivityOrgasmGameResistCount / 2);"
            });

        HookManager.patchAdd('ChatRoomMenuDraw',
            { // 处理余韵对跪下的按钮的颜色处理
                // 处理什么时候为黄色
                'else if (name === "Kneel" && (Player.AllowedActivePoseMapping.BodyLower || Player.AllowedActivePoseMapping.BodyFull))':
                    'else if (name === "Kneel" && (Player.AllowedActivePoseMapping.BodyLower || Player.AllowedActivePoseMapping.BodyFull|| (Player?.XSBE?.aftertasteEffect?.has("weakness"))))',
                // 处理什么时候为红色
                'if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel()))':
                    'if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel()) && !Player?.XSBE?.aftertasteEffect?.has("absentminded"))'
            });
    }

    /**
     * 处理余韵等级的回落
     * 高潮抵抗等级越大恢复越少 最多恢复20点 如果高潮抵抗等级超过20 则每次只恢复1点
     */
    private AftertasteFallBack(): void {
        const n = 20 - ActivityOrgasmGameResistCount
        const fallBackNumber = n <= 0 ? 1 : n;
        this.Aftertaste = this.Aftertaste - fallBackNumber;
        if (this._aftertaste < 0) this.Aftertaste = 0;
    }

    /** 余韵效果开关 */
    private afterEffectSwitch: { [name in AftertasteEffect]: boolean } = {
        relax: false,
        weakness: false,
        twitch: false,
        trance: false,
        absentminded: false
    }
    /** 余韵效果描述 */
    private afterEffectDescribe: { [name in AftertasteEffect]: string[] } = {
        relax: [`${PH.s}的身体在快感冲击下软了下来。浑身软绵绵的使不上力气。`,
        `${PH.s}的身体渐渐恢复，重新恢复了正常的体力。`],
        weakness: [`${PH.s}的身体在连续的快感冲击中变得越来越软，越来越无力，已经难以控制自己的身体。`,
        `${PH.s}的身体虽然还是软绵绵的，但大概可以正常走路了。`],
        twitch: [`连续深度的高潮冲击下，${PH.s}的身体不自觉的开始抽搐，再这么下去...`,
        `${PH.s}停止了抽搐，但还是很难支撑起自己的身体。`],
        trance: [`高潮过于猛烈，${PH.s}的脑袋已经不清楚了。恍恍惚惚，意识断断续续。想要移动的话..应该需要很大的意志力才能挪动吧。`,
        `${PH.s}的意识恢复了，但身体还是时不时的抽动一下。`],
        absentminded: [`强大的、连续的、不可抵挡的高潮冲击下，${PH.s}已经完全无法控制自己的身体。只能在无意识中抽搐着身体，发出细软的声音。这样的话...`,
        `${PH.s}虽然还是恍恍惚惚，意识算是渐渐恢复了，希望这段时间没有发生什么。`]
    }

    /**
     * 开关余韵效果
     * @param name 要开关的效果名字
     * @param value 开还是关?
     */
    private setAftertasteEffectSwitch(name: AftertasteEffect, value: boolean) {
        const switchState = this.afterEffectSwitch[name];
        if (switchState != value) {
            if (value) {
                this._aftertasteEffectSet.add(name);

                if (name === 'relax') {
                    AssetManager.PlayAudio('heartbeat', 0.5);
                    if (Player.IsStanding()) PoseSetActive(Player, 'Kneel'); // 当放松时 自动跪下
                }
                if (name === 'weakness') {
                    AssetManager.PlayAudio('heartbeat');
                }
                if (name === 'twitch') {
                    AssetManager.PlayAudio('faultSound'); // 当抽搐时 自动播放 心跳音效
                }
                if (name === 'trance') {
                    // AssetManager.PlayAudio('heartbeat');
                    AssetManager.PlayAudio('sleep');
                }
                if (name === 'absentminded') {
                    // AssetManager.PlayAudio('heartbeat');
                    AssetManager.PlayAudio('sleep')
                }

                MSGManager.SendActivity(this.afterEffectDescribe[name][0], Player.MemberNumber!);
            } else {
                this._aftertasteEffectSet.delete(name);
                MSGManager.SendActivity(this.afterEffectDescribe[name][1], Player.MemberNumber!);
            }
            this.afterEffectSwitch[name] = value;
        }
    }
    /** 余韵效果的集合 */
    private _aftertasteEffectSet: Set<AftertasteEffect> = new Set();
    /**
     * 余韵效果的判断与处理
     * @param pushToServer 是否同步到服务器
     */
    private AftertasteEffectSetHandler(pushToServer: boolean): void {
        const effectThresholds: Array<{ threshold: number, effect: AftertasteEffect }> = [
            { threshold: 20, effect: "relax" },
            { threshold: 50, effect: "weakness" },
            { threshold: 70, effect: "twitch" },
            { threshold: 90, effect: "trance" },
            { threshold: 100, effect: "absentminded" },
        ];

        for (const { threshold, effect } of effectThresholds) {
            this.setAftertasteEffectSwitch(effect, this._aftertaste > threshold);
        }

        DataManager.set('aftertasteEffect', this._aftertasteEffectSet, pushToServer);
    }

    /** 默认的输入框样式 */
    inputDefaultStyle: { backgroundColor: string, borderColor: string, borderRadius: string } | undefined = undefined;
    inputDisabled: boolean = false;
    /**
     * 获取{@link HTMLTextAreaElement}的默认样式，根据{@param isAbsent}决定是否禁用或取消禁用
     * @param isAbsent 是否为失能状态
     */
    private DisableInput(isAbsent: boolean): void {
        const inputElement: HTMLTextAreaElement | null = document.getElementById("InputChat") as HTMLTextAreaElement;
        if (!inputElement) return;
        if (isAbsent) {
            if (!inputElement.readOnly) {
                if (!this.inputDefaultStyle) {
                    this.inputDefaultStyle = {
                        backgroundColor: inputElement.style.backgroundColor,
                        borderColor: inputElement.style.borderColor,
                        borderRadius: inputElement.style.borderRadius
                    };
                }
                inputElement.readOnly = true;
                this.inputDisabled = true;
                inputElement.style.backgroundColor = "#8d6f83";
                inputElement.style.borderColor = "#ea44a9";
                inputElement.style.borderRadius = "5px";
            }
        } else {
            if (inputElement.readOnly) {
                inputElement.readOnly = false;
                this.inputDisabled = false;
                if (this.inputDefaultStyle) {
                    inputElement.style.backgroundColor = this.inputDefaultStyle.backgroundColor;
                    inputElement.style.borderColor = this.inputDefaultStyle.borderColor;
                    inputElement.style.borderRadius = this.inputDefaultStyle.borderRadius;
                }
            }
        }
    }
}