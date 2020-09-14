import { combineReducers } from "redux";
import tree from "./tree";
import profile from "./profile";
import chats from "../redux/reducers/chat_reducer";

const rootReducer = combineReducers({
  tree,
  chats,
  profile,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
