import { writeDebug } from '../../common/ipcCommunication/ipcLogger';
import {
    SET_LOGIN_USER_INFO
} from '../actions/types';

export default function (state = {}, action) {

    switch (action.type) {
        case SET_LOGIN_USER_INFO:
            writeDebug('SET_LOGIN_USER_INFO : ', action.payload)
            return {
                ...state, loggedInUser: action.payload
            }
        default:
            return state;
    }
}



