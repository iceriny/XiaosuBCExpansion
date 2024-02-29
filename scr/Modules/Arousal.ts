import { BaseModule } from "../Base/BaseModule";
//import { AssetManager } from "../Utilities/AssetManager";
import { DataManager } from "../Utilities/DataManager";
import { HookManager } from "../Utilities/HookManager";
import { MSGManager, PH } from "../Utilities/MessageManager";
import { TimerProcessInjector } from "../Utilities/TimerProcessInjector";
import { SkillSetNegativeModifier } from "../Utilities/Utilities";


type AftertasteEffect = 'relax' | 'weakness' | 'twitch' | 'trance' | 'absentminded'
export class ArousalModule extends BaseModule {
    private _aftertaste: number = 0;
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
    public Load(): void { }

    public getArousalSettings = (C: Character | PlayerCharacter): ArousalSettingsType | undefined => C.ArousalSettings;

    public getOrgasmStage = (C: Character | PlayerCharacter): number => this.getArousalSettings(C)?.OrgasmStage ?? 0;

    public set Aftertaste(level: number) {
        DataManager.data.set('aftertaste', level, 'online', true);
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
        HookManager.setHook('ActivityOrgasmStart', 'AftertasteSet', 2, () => {
            const addedNumber = ActivityOrgasmGameResistCount + 1;
            this.Aftertaste = this._aftertaste + addedNumber;
            // Player.PoseMapping/////////////
            if (this._aftertaste > 120) this.Aftertaste = 120;
            this.AftertasteEffectSetHandler(true);
        })

        HookManager.setHook('Player.GetSlowLevel', 'aftertasteWeaknessEffect', 2, (args) => {
            if (Player.RestrictionSettings?.SlowImmunity)
                return { args: args, result: 0 };
            else if (this._aftertasteEffectSet.has('weakness')) {
                let slowLevel = 1;
                if (this._aftertaste > 55) slowLevel = 2;
                if (this._aftertaste > 60) slowLevel = 3;
                if (this._aftertaste > 70) slowLevel = 4;

                if (Player.HasEffect("Slow")) slowLevel++;
                if (Player.PoseMapping.BodyFull === "AllFours") slowLevel += 2;
                else if (Player.PoseMapping.BodyLower === "Kneel") slowLevel += 1;
                return { args: args, result: slowLevel }
            }
            return;
        })
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
                    DataManager.data.set('resistCount', ActivityOrgasmGameResistCount, 'online', true)
                } else if (Player.ArousalSettings!.Progress < 60 && ActivityOrgasmGameResistCount >= 1) {
                    ActivityOrgasmGameResistCount--;
                }
            },
            name: "EdgeTimer"
        });

        // 处理高潮余韵的恢复 每15秒回复 1
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
                    SkillSetNegativeModifier('Bondage', -5, 5000);
                    SkillSetNegativeModifier('SelfBondage', -5, 5000);
                    SkillSetNegativeModifier('LockPicking', -3, 5000);
                    SkillSetNegativeModifier('Evasion', -8, 5000);
                    SkillSetNegativeModifier('Willpower', -3, 5000);
                    SkillSetNegativeModifier('Infiltration', -7, 5000);
                    SkillSetNegativeModifier('Dressage', -7, 5000);
                }
            },
            name: "AftertasteEffectHandle"
        });

        // 处理高潮余韵的抽搐效果
        TimerProcessInjector.add(98, 3000, () => {
            return this._aftertaste >= 70;
        }, {
            code: () => {
                if (this._aftertasteEffectSet.has('twitch')) {
                    //AssetManager.getAssets<HTMLAudioElement>('sun','sound')!.play(); ///////////////////////////////////////////
                }
            },
            name: "AftertasteEffectHandle"
        });

        // 处理是否需要禁用输入
        TimerProcessInjector.add(-1, 200, () => {
            return CurrentScreen == "ChatRoom" && Player.MemberNumber !== undefined;
        }, {
            code: () => {
                const orgasmStage = Player.ArousalSettings?.OrgasmStage;
                if (orgasmStage == 1) {
                    this.needSendEnduringMessage = true;
                    if (!this.inputDisabled) {
                        this.DisableInput(true);
                    }
                }
                else if (orgasmStage == 0) {
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
    }


    /**
     * 处理余韵等级的回落
     */
    private AftertasteFallBack(): void {
        const n = 20 - ActivityOrgasmGameResistCount
        const fallBackNumber = n <= 0 ? 1 : n;
        this.Aftertaste = this.Aftertaste - fallBackNumber;
        if (this._aftertaste < 0) this.Aftertaste = 0;
    }

    private _aftertasteEffectSet: Set<AftertasteEffect> = new Set();
    private AftertasteEffectSetHandler(pushToServer: boolean): void {
        const newAftertasteEffectSet: Set<AftertasteEffect> = new Set()
        if (this._aftertaste > 20) {
            newAftertasteEffectSet.add("relax"); //放松
            MSGManager.SendActivity(`${PH.s}的身体在快感冲击下软了下来。浑身软绵绵的使不上力气。`, Player.MemberNumber!);
        }
        if (this._aftertaste > 50) {
            newAftertasteEffectSet.add("weakness"); // 虚弱
            MSGManager.SendActivity(`${PH.s}的身体在连续的快感冲击中瘫软起来，似乎已经很难支撑起身体了。`, Player.MemberNumber!);
        }
        if (this._aftertaste > 70) {
            newAftertasteEffectSet.add("twitch"); // 抽搐
            MSGManager.SendActivity(`连续深度的高潮冲击下，${PH.s}的身体不自觉的开始抽搐，再这么下去...`, Player.MemberNumber!);
        }
        if (this._aftertaste > 90) {
            newAftertasteEffectSet.add("trance"); // 恍惚
            MSGManager.SendActivity(`高潮过于猛烈，${PH.s}的脑袋已经不清楚了。恍恍惚惚，意识断断续续。`, Player.MemberNumber!);
        }
        if (this._aftertaste > 100) {
            newAftertasteEffectSet.add("absentminded"); // 失能
            MSGManager.SendActivity(`强大的、连续的、不可抵挡的高潮冲击下，${PH.s}已经无法控制自己的身体。只能在无意识中抽搐着身体，发出细软的声音。这样的话...`, Player.MemberNumber!);
        }
        DataManager.data.set('aftertasteEffect', newAftertasteEffectSet, 'online', pushToServer);
        this._aftertasteEffectSet = newAftertasteEffectSet;
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