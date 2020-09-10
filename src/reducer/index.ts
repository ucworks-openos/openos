import { combineReducers } from "redux";
import tree from "./tree";
import chats from "../redux/reducers/chat_reducer";

const rootReducer = combineReducers({
  tree,
  chats,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
