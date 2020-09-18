import axios from 'axios';
import {
    GET_INITIAL_CHAT_ROOMS,
    GET_INITIAL_CHAT_MESSAGES,
    SET_CURRENT_CHAT_ROOM,
    GET_MORE_CHATS_MESSAGES,
    ADD_CHAT_MESSAGE,
    DELETE_CHAT_MESSAGE,
    GET_SEARCHED_CHAT_MESSAGES
} from './types';
import chatMessages from "../mock-datas/chat-messages.json";
import { getChatRoomList, sendChatMessage } from '../../components/ipcCommunication/ipcMessage'

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
    return {
        type: GET_INITIAL_CHAT_ROOMS,
        payload: realRequest
    }
}

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

export function getInitialChatMessages(roomId) {

    let request;
    if (roomId) {
        request = chatMessages.filter(msg => msg.roomId === roomId)
    } else {
        request = chatMessages
    }

    return {
        type: GET_INITIAL_CHAT_MESSAGES,
        payload: request
    }
}


export function addChatMessage(chatUsersId, chatMessage, isNewChat, chatRoomId = null) {

    let userIds = chatUsersId.split('|')
    sendChatMessage(userIds, chatMessage, isNewChat ? null : chatRoomId);

    return {
        type: ADD_CHAT_MESSAGE,
        // payload: newMessage
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

// export function deleteChatMessage(item) {
//     const request = axios.delete(`${SERVER_URI}:5000/api/talk?talkId=${item.id}`)
//         .then(response => {
//             return { id: item.id }
//         });

//     return {
//         type: DELETE_CHAT_MESSAGE,
//         payload: request
//     }
// }

// export function getSearchedChatMessages(bandId, searchTerm) {
//     const request = axios.get(`${SERVER_URI}:5000/api/talk?bandId=${bandId}&searchTerm=${encodeURIComponent(searchTerm)}&page=1&type=search`)
//         .then(response => response.data);

//     return {
//         type: GET_SEARCHED_CHAT_MESSAGES,
//         payload: request
//     }
// }

