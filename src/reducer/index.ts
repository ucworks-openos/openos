import { combineReducers } from "redux";
import tree from "./tree";

const rootReducer = combineReducers({
    tree
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;