import { IPushAuth } from "./types";

export const initialState: IPushAuth = {
    challengeId: null,
    status: 'idle',
    pageAttributes: {
        isAuthenticating: false,
    }
};