import { all, fork} from 'redux-saga/effects';
import { pushAuthSaga } from './push-auth/saga';

export default function* rootSaga() {
    yield all([
        fork(pushAuthSaga)
    ]);
}