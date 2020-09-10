import {
    GET_INITIAL_MESSAGE_LISTS,
    GET_MESSAGE,
    SET_CURRENT_MESSAGE,
    ADD_MESSAGE
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INITIAL_MESSAGE_LISTS:
            return { ...state, messageLists: action.payload, currentMessage: action.payload[0].id }
        case GET_MESSAGE:
            return { ...state, message: action.payload }
        case SET_CURRENT_MESSAGE:
            return { ...state, currentMessage: action.payload }
        // case GET_MORE_CHATS_MESSAGES:
        //     return { ...state, chats: [...action.payload, ...state.chats], chatLength: action.payload.length, type: "normal" }
        case ADD_MESSAGE:
            return {
                ...state,
                messageLists: state.messageLists.concat(action.payload)
            };
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



