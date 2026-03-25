import { call, delay, put, race, takeLatest } from "redux-saga/effects";
import { invokeAuthNotificationAction } from "./async-actions";
import { pushAuthActions } from "./slice";
import { checkChallengeStatus, requestChallenge } from "../../service/authService";

function* invokeAuth() {
    yield put(pushAuthActions.isAuthenticating(true));
    try {
        // @ts-ignore
        const { data: challengeId } = yield call(requestChallenge);

        yield put(pushAuthActions.setChallengeId(challengeId));

        const { approved, timeout } = yield race({
            approved: call(pollChallengeStatus, challengeId),
            timeout: delay(600000)
        });

        if(timeout) {
            console.log('@test - hits timeout')
            yield put(pushAuthActions.challengeTimeout());
            return;
        }

        console.log('@test - poll status', approved);

        if (approved === "approved" )
            yield put(pushAuthActions.challengeApproved());
        else 
            yield put(pushAuthActions.challengeRejected());

    } catch (error) {
        console.error(error);
        yield put(pushAuthActions.challengeRejected());
    } finally {
        yield put(pushAuthActions.isAuthenticating(false));
    }
}

function* pollChallengeStatus(id: string) {
    while(true) {
        console.log('@test - Polling initiated');
        // @ts-ignore
        const result = yield call(checkChallengeStatus, id);

        if (result.status === 200) {
            if (result.data.status === "approved") return "approved";
            if (result.data.status === "rejected") return "rejected";
        }

        yield delay(2000);
    }
}

export function* pushAuthSaga() {
    yield takeLatest(invokeAuthNotificationAction.type, invokeAuth);
}