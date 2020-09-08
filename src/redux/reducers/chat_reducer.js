import {
    GET_INITIAL_CHAT_ROOMS,
    GET_INITIAL_CHAT_MESSAGES,
    SET_CURRENT_CHAT_ROOM
    // GET_MORE_CHATS_MESSAGES,
    // ADD_CHAT_MESSAGE,
    // DELETE_CHAT_MESSAGE,
    // GET_SEARCHED_CHAT_MESSAGES
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INITIAL_CHAT_ROOMS:
            return { ...state, chatRooms: action.payload }
        case GET_INITIAL_CHAT_MESSAGES:
            return { ...state, chatMessages: action.payload }
        case SET_CURRENT_CHAT_ROOM:
            return { ...state, currentChatRoom: action.payload }
        // case GET_MORE_CHATS_MESSAGES:
        //     return { ...state, chats: [...action.payload, ...state.chats], chatLength: action.payload.length, type: "normal" }
        // case ADD_CHAT_MESSAGE:
        //     return {
        //         ...state,
        //         chats: state.chats.concat(action.payload),
        //         type: "normal"
        //     };
        // case DELETE_CHAT_MESSAGE:
        //     let deletedMessage = action.payload
        //     let filteredMessages = state.chats.filter(chat => chat.id !== deletedMessage.id)
        //     return {
        //         ...state, chats: filteredMessages
        //     }
        // case GET_SEARCHED_CHAT_MESSAGES:
        //     return { ...state, chats: action.payload, chatLength: action.payload.length, type: "search" }
        default:
            return state;
    }
}



