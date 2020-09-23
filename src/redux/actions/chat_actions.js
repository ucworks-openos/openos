import axios from 'axios';
import {
    GET_INITIAL_CHAT_ROOMS,
    GET_INITIAL_CHAT_MESSAGES,
    SET_CURRENT_CHAT_ROOM,
    GET_MORE_CHATS_MESSAGES,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_ROOM
} from './types';
import { getChatRoomList, sendChatMessage, getChatList } from '../../components/ipcCommunication/ipcMessage'
import moment from 'moment';

export function setCurrentChatRoom(roomKey, chatRooms) {
    const request = chatRooms.filter(c => c.room_key === roomKey)

    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: request
    }
}

export async function getInitialChatRooms() {
    const request = await getChatRoomList(0, 100)
    const realRequest = Array.isArray(request.data.table.row) ? request.data.table.row : [request.data.table.row]
    console.log('realRequest', realRequest)
    return {
        type: GET_INITIAL_CHAT_ROOMS,
        payload: realRequest
    }
}

export async function getInitialChatMessages(chatRoomId, lastLineKey) {
    let getChatListsResult = await getChatList(chatRoomId, lastLineKey, 100)
    return {
        type: GET_INITIAL_CHAT_MESSAGES,
        payload: Array.isArray(getChatListsResult.data.table.row) ? getChatListsResult.data.table.row : [getChatListsResult.data.table.row]
    }
}

export function addChatMessage(chatUsersId, chatMessage, isNewChat, chatRoomId = null, senderName, senderId) {

    let userIds = chatUsersId.split('|')

    sendChatMessage(userIds, chatMessage, isNewChat ? null : chatRoomId);

    let request = {
        chat_contents: chatMessage,
        chat_send_name: senderName,
        chat_send_date: moment().format("YYYYMMDDHHmm"),
        read_count: 0,
        chat_send_id: senderId
    }

    return {
        type: ADD_CHAT_MESSAGE,
        payload: request
    }
}

export function addChatRoom(request) {

    return {
        type: ADD_CHAT_ROOM,
        payload: request
    }
}

// export function getMoreChatMessages(bandId, page = 1) {
//     const request = axios.get(`${SERVER_URI}:5000/api/talk?bandId=${bandId}&page=${page}`)
//         .then(response => response.data);

//     return {
//         type: GET_MORE_CHATS_MESSAGES,
//         payload: request
//     }
// }


// export async function getInitialChatRooms() {
//     const getChatRoomListResponse = await getChatRoomList(0, 100)
//     let chatRoomWithMembers = []
//     getChatRoomListResponse.data.table.row.forEach(async chatRoomItem => {
//         let convertedIds = chatRoomItem.chat_entry_ids.split('|')
//         const getUserInfosResponse = await getUserInfos(convertedIds)
//         chatRoomItem.userInfos = Array.isArray(getUserInfosResponse.data.items.node_item) ? getUserInfosResponse.data.items.node_item : [getUserInfosResponse.data.items.node_item]
//         chatRoomWithMembers.push(chatRoomItem)
//     })

//     console.log('chatRoomWithMembers request: ', chatRoomWithMembers)

//     return {
//         type: GET_INITIAL_CHAT_ROOMS,
//         payload: chatRoomWithMembers
//     }
// }
