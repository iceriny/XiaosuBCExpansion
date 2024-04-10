type LocalMessageCSSName = null | "local-message" | "trance-message";
const selfPlaceholder = "{source}";
/** 描述中表示目标的占位符 */

const targetPlaceholder = "{target}";
/**
 * 包含全局占位符的对象 s:自己  t:目标
 */
export const PH = {
    s: selfPlaceholder,
    t: targetPlaceholder,
};
export default class MSGManager {
    /**
     * 发送*表情信息
     * @param msg 要发送的内容
     * @returns 无
     */
    static SendEmote(msg: string | null) {
        if (msg == null) return;
        ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });
    }
    /**
     * 发送聊天消息
     * @param msg 发送的内容
     * @returns 无
     */
    static SendChat(msg: string | null) {
        if (msg == null) return;
        ServerSend("ChatRoomChat", { Type: "Chat", Content: msg });
    }

    /**
     * 发送本地消息
     * @param msg 发送的消息
     * @param className 本地消息的样式ClassName
     * @param timeout 持续时间
     */
    static SendLocalMessage(
        msg: string,
        timeout: number = 0,
        className: LocalMessageCSSName = null
    ) {
        if (className !== null) {
            msg = `<div class="${className}">${msg}</div>`;
        }
        if (timeout === 0) ChatRoomSendLocal(msg);
        else ChatRoomSendLocal(msg, timeout);
    }
    /**
     * 发送动作消息
     * @param msg 动作消息的内容
     * @param sourceCharacter 动作的来源 id
     * @param targetCharacter 动作的目标 id
     */
    static SendActivity(
        msg: string,
        sourceCharacter: number,
        targetCharacter?: number
    ) {
        const sourceCharacterObj: Character | undefined =
                ChatRoomCharacter.find(
                    (c) => c.MemberNumber == sourceCharacter
                ),
            targetCharacterObj: Character | undefined = targetCharacter
                ? ChatRoomCharacter.find(
                      (c) => c.MemberNumber == targetCharacter
                  )
                : undefined;

        if (
            sourceCharacterObj === undefined &&
            targetCharacterObj === undefined
        )
            return;

        const sourceCharacterNickname = sourceCharacterObj
                ? CharacterNickname(sourceCharacterObj)
                : "",
            targetCharacterNickname = targetCharacterObj
                ? CharacterNickname(targetCharacterObj)
                : "";
        const resultDict: ChatMessageDictionary = [
            {
                Tag: "MISSING ACTIVITY DESCRIPTION FOR KEYWORD XSBE_ActMessage",
                Text: msg
                    .replaceAll(PH.s, sourceCharacterNickname)
                    .replaceAll(PH.t, targetCharacterNickname),
            },
        ];

        resultDict.push({ SourceCharacter: sourceCharacter });
        if (targetCharacter !== undefined)
            resultDict.push({ TargetCharacter: targetCharacter });
        ServerSend("ChatRoomChat", {
            Type: "Activity",
            Content: "XSBE_ActMessage",
            Dictionary: resultDict,
            Sender: sourceCharacter,
        });
    }
}
