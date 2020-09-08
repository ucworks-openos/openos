import axios from 'axios';
import {
    GET_INITIAL_CHAT_MESSAGES,
    GET_MORE_CHATS_MESSAGES,
    ADD_CHAT_MESSAGE,
    DELETE_CHAT_MESSAGE,
    GET_SEARCHED_CHAT_MESSAGES
} from './types';

export function getInitialChatMessages(bandId, page = 1) {
    const request = axios.get(`:5000/api/talk?bandId=${bandId}&page=${page}`)
        .then(response => response.data);

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

