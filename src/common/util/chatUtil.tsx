import { writeError } from "../ipcCommunication/ipcLogger";
import { getDispUserNames } from "./userUtil";

/**
 * 여러 사용자의 표출되는 이름을 가져온다.
 * 지정되는 사용자의 이름들 외 몇명 표출을 지정가능
 * @param {Array} userIds 
 * @param {Number} viewUserCnt 
 */
export const getChatRoomName = (chatEntryNames:String, chatUserIds:Array<String>) => {
    try {
        if (chatEntryNames) {
            // 'UCWARE_CHAT_ROOM_TITLE'로 시작된다면 별도 대화명을 입력 한것이다.
            if (chatEntryNames.startsWith('UCWARE_CHAT_ROOM_TITLE')) {
                return chatEntryNames.split(String.fromCharCode(20))[1];
            } else {
                return chatEntryNames;
            }
        
        } else {
            return chatUserIds?.join(',')

            //  방이름이 없으니 만들어 준다. 3명이상은 '외'로 표기
            //return getDispUserNames(chatUserIds, 3)  // 다시 요청 하지 않도록 수정한다.
        }
    } catch (error) {
        writeError('getChatRoomName Error', chatEntryNames, chatUserIds, error)
    }
};

/**
 * chat_entry_ids 에서 참여자 아이디를 배열로 반환한다.
 * 
 * 구분자 오류를 방지하기 위해 Function으로 분리
 */
export const getChatUserIds = (chatEntryIds:String) => {
    if (chatEntryIds) {
        return chatEntryIds.split('|')
    } else {
        //  방이름이 없으니 만들어 준다. 3명이상은 '외'로 표기
        return []  // 다시 요청 하지 않도록 수정한다.
    }
};