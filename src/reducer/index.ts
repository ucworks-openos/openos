import { combineReducers } from "redux";
import tree from "./tree";
import chats from "../redux/reducers/chat_reducer";
import messages from "../redux/reducers/message_reducer";

const rootReducer = combineReducers({
    tree,
    chats,
    messages
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;