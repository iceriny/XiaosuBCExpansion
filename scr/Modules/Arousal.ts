import { BaseModule } from "../Base/BaseModule";
import { DataManager } from "../Utilities/DataManager";
import { HookManager } from "../Utilities/HookManager";
import { MSGManager } from "../Utilities/MessageManager";
import { TimerProcessInjector } from "../Utilities/TimerProcessInjector";

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

    private HookList(): void {
        HookManager.setHook('ActivityOrgasmStart', 'AftertasteSet', 0, () => {
            // 处理高潮余韵等级的增加
            const n = Math.floor(ActivityOrgasmGameResistCount / 2)
            const addedNumber = n == 0 ? 1 : n;
            this.Aftertaste = this._aftertaste + addedNumber;
            if (this._aftertaste > 100) this.Aftertaste = 100;
        })
    }


    private TimerProcess(): void {
        // 处理边缘增加抵抗高潮难度
        TimerProcessInjector.add(101, 45000, () => {
            return !!Player.ArousalSettings
        }, {
            code: () => {
                if (Player.ArousalSettings!.Progress >= 93) {
                    ActivityOrgasmGameResistCount++;
                    DataManager.data.set('resistCount', ActivityOrgasmGameResistCount, 'online', true)
                } else {
                    if (ActivityOrgasmGameResistCount >= 1) ActivityOrgasmGameResistCount--;
                }
            },
            name: "EdgeTimer"
        });

        TimerProcessInjector.add(-1, 200, () => {
            return CurrentScreen == "ChatRoom" && Player.MemberNumber !== undefined;
        }, {
            code: () => {
                const inputElement: HTMLTextAreaElement | null = document.getElementById("InputChat") as HTMLTextAreaElement;
                const orgasmStage = Player.ArousalSettings?.OrgasmStage;
                if (orgasmStage == 2 || orgasmStage == 1) {
                    this.setFormElementsForAbsentState(inputElement, true);
                    if (Player.ArousalSettings?.OrgasmStage == 1) {
                        if (Math.random() < 0.3) MSGManager.SendActivity(this.getEndureDesc, Player.MemberNumber!);
                    }
                } else {
                    this.setFormElementsForAbsentState(inputElement, false);
                }
            },
            name: "DisableInput"
        });


        // 15秒后恢复 // 处理高潮余韵的恢复 每15秒回复 1
        TimerProcessInjector.add(100, 15000, () => {
            return this._aftertaste > 0;
        }, {
            code: () => {
                this.AftertasteFallBack();
            },
            name: "AftertasteFallBack"
        });



        // // 处理高潮余韵的效果列表
        // TimerProcessInjector.add(99, 0, () => {
        //     return this._aftertaste > 0;
        // }, {
        //     code: () => {
        //         if (this._aftertaste > 0) {
        //             HookManager.setHook('ActivityOrgasmStart', 'AftertasteSet', 0, () => {
        //                 this.Aftertaste = this._aftertaste - 1;
        //             })
        //         } 
        //     },
        //     name: "AftertasteAddEffect"
        // })
    }

    /**
     * 补丁列表处理
     */
    private patchListHandler(): void {
        // 处理OrgasmStart
        HookManager.patchAdd("ActivityOrgasmStart",
            {// XSA补丁处理~ 基础高潮时间为 4~7秒, 每边缘45秒钟增加随机的 300ms ~ 1300ms 的高潮时间。 最多增加 20000ms，也就是最长高潮时间为 27 秒
                "C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;":
                    `if (!Player.XSBE) {
                C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
            } else if (C.IsPlayer()) {
                const addedTime = (Math.random() + 0.3) * 1000 * ActivityOrgasmGameResistCount;
                C.ArousalSettings.OrgasmTimer = CurrentTime + (addedTime > 20000 ? 20000 : addedTime) + 4000 + (3000 * Math.random());
            }`,
                // 高潮时将抵抗难度减半而非变为0
                "ActivityOrgasmGameResistCount = 0;":
                    "ActivityOrgasmGameResistCount = Math.round(ActivityOrgasmGameResistCount / 2);"
            });
    }

    private AftertasteFallBack(): void {
        const n = 30 - ActivityOrgasmGameResistCount
        const fallBackNumber = n <= 0 ? 1 : n;
        this.Aftertaste = this.Aftertaste - fallBackNumber;
        if (this._aftertaste < 0) this.Aftertaste = 0;
    }

    /** 默认的输入框样式 */
    inputDefaultStyle: { backgroundColor: string, borderColor: string, borderRadius: string } | undefined = undefined;
    /**
     * 获取{@link HTMLTextAreaElement}的默认样式，根据{@param isAbsent}决定是否禁用或取消禁用
     * @param formElements 表单元素
     * @param isAbsent 是否为失能状态
     */
    private setFormElementsForAbsentState(formElements: HTMLTextAreaElement | null, isAbsent: boolean): void {
        if (!formElements) return;
        if (isAbsent) {
            if (!formElements.readOnly) {
                if (!this.inputDefaultStyle) {
                    this.inputDefaultStyle = {
                        backgroundColor: formElements.style.backgroundColor,
                        borderColor: formElements.style.borderColor,
                        borderRadius: formElements.style.borderRadius
                    };
                }
                formElements.readOnly = true;
                formElements.style.backgroundColor = "#8d6f83";
                formElements.style.borderColor = "#ea44a9";
                formElements.style.borderRadius = "5px";
            }
        } else {
            if (formElements.readOnly) {
                formElements.readOnly = false;
                if (this.inputDefaultStyle) {
                    formElements.style.backgroundColor = this.inputDefaultStyle.backgroundColor;
                    formElements.style.borderColor = this.inputDefaultStyle.borderColor;
                    formElements.style.borderRadius = this.inputDefaultStyle.borderRadius;
                }
            }
        }
    }
}