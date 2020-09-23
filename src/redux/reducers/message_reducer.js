import {
    GET_INITIAL_MESSAGE_LISTS,
    GET_MESSAGE,
    SET_CURRENT_MESSAGE,
    GET_MORE_MESSAGES,
    ADD_MESSAGE,
    SET_CURRENT_MESSAGE_LISTS_TYPE
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_INITIAL_MESSAGE_LISTS:
            return {
                ...state, messageLists: action.payload,
                currentMessage: action.payload[0].msg_key, page: 1,
                messageCounts: action.payload.length,
                messageDefaultCounts: 10
            }
        case GET_MESSAGE:
            return { ...state, message: action.payload }
        case SET_CURRENT_MESSAGE:
            return { ...state, currentMessage: action.payload }
        case GET_MORE_MESSAGES:
            return {
                ...state, messageLists: [...state.messageLists, ...action.payload],
                messageCounts: action.payload.length,
                page: state.page + 1
            }
        case ADD_MESSAGE:
            return {
                ...state,
                messageLists: [action.payload, ...state.messageLists]
            };
        case SET_CURRENT_MESSAGE_LISTS_TYPE:
            return { ...state, currentMessageListType: action.payload }


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



