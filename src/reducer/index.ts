import { combineReducers } from "redux";
import tree from "./tree";
import profile from "./profile";
import search from "./search";
import chats from "../redux/reducers/chat_reducer";
import messages from "../redux/reducers/message_reducer";

const rootReducer = combineReducers({
  tree,
  profile,
  search,
  chats,
  messages,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
