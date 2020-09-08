import { combineReducers } from 'redux';
import chats from './chat_reducer';

const rootReducer = combineReducers({
    chats
});

export default rootReducer;