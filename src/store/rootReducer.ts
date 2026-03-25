import { combineReducers } from "@reduxjs/toolkit";
import { pushAuthReducer } from "./push-auth/slice";

export const rootReducer = combineReducers({
    pushAuth: pushAuthReducer
});