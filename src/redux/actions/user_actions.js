import { writeDebug } from '../../common/ipcCommunication/ipcLogger';
import {
    SET_LOGIN_USER_INFO
} from './types';

export async function setLoginUserInfo(userInfo) {  // TUser Type

    writeDebug('setLoginUserInfo : ', userInfo)

    return {
        type: SET_LOGIN_USER_INFO,
        payload: userInfo
    }
}
