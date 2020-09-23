import { combineReducers } from "redux";
import tree from "./tree";
import search from "./search";
import chats from "../redux/reducers/chat_reducer";
import messages from "../redux/reducers/message_reducer";
import users from "../redux/reducers/user_reducer";
const rootReducer = combineReducers({
  tree,
  search,
  chats,
  messages,
  users
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
