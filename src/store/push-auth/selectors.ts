import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "../types";

const selectDomain = (rootState: IRootState) => rootState.pushAuth;

const selectPushAuth = createSelector([selectDomain], state => state);

const selectIsAuthenticated = createSelector([selectDomain], state => state.status === "approved");

export { selectPushAuth, selectIsAuthenticated };
