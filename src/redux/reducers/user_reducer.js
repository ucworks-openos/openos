import {
    GET_LOGGED_IN_USER_INFO
} from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case GET_LOGGED_IN_USER_INFO:
            return {
                ...state, loggedInUser: action.payload
            }
        default:
            return state;
    }
}



