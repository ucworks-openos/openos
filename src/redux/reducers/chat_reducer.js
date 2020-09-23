import {
    GET_INITIAL_CHAT_ROOMS,
    GET_INITIAL_CHAT_MESSAGES,
    SET_CURRENT_CHAT_ROOM,
    // GET_MORE_CHATS_MESSAGES,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_ROOM
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INITIAL_CHAT_ROOMS:
            return {
                ...state, chatRooms: action.payload,
                currentChatRoom: action.payload && action.payload[0]
            }
        case SET_CURRENT_CHAT_ROOM:
            return { ...state, currentChatRoom: action.payload[0] }
        case GET_INITIAL_CHAT_MESSAGES:
            return { ...state, chatMessages: action.payload }
        // case GET_MORE_CHATS_MESSAGES:
        //     return { ...state, chats: [...action.payload, ...state.chats], chatLength: action.payload.length, type: "normal" }
        case ADD_CHAT_ROOM:
            return { ...state, chatRooms: [action.payload, ...state.chatRooms] }
        case ADD_CHAT_MESSAGE:
            return {
                ...state,
                chatMessages: state.chatMessages.concat(action.payload)
            };
        default:
            return state;
    }
}



