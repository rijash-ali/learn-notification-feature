import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./utils";

const slice = createSlice({
    name: 'pushAuth',
    initialState,
    reducers: {
        setChallengeId: (state, action) => {
            state.challengeId = action.payload;
        },
        startLogin: (state) => {
            state.status = "pending";
        },
        challengeApproved: state => {
            state.status = "approved";
        },
        challengeRejected: state => {
            state.status = "rejected";
        },
        challengeTimeout: state => {
            state.status = "timeout";
        },
        isAuthenticating: (state, action) => {
            state.pageAttributes.isAuthenticating = action.payload;
        },
    }
});

export const {
    name: pushAuthName,
    reducer: pushAuthReducer,
    actions: pushAuthActions
} = slice;
