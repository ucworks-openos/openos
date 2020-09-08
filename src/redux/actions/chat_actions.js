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
import chatRooms from "../mock-datas/chat-rooms.json";
import chatMessages from "../mock-datas/chat-messages.json";

export function setCurrentChatRoom() {

    return {
        type: SET_CURRENT_CHAT_ROOM,
        payload: chatRooms
    }
}

export function getInitialChatRooms() {

    return {
        type: GET_INITIAL_CHAT_ROOMS,
        payload: chatRooms
    }
}

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

// export function getMoreChatMessages(bandId, page = 1) {
//     const request = axios.get(`${SERVER_URI}:5000/api/talk?bandId=${bandId}&page=${page}`)
//         .then(response => response.data);

//     return {
//         type: GET_MORE_CHATS_MESSAGES,
//         payload: request
//     }
// }

// export function addChatMessage(variables) {
//     return {
//         type: ADD_CHAT_MESSAGE,
//         payload: variables
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

