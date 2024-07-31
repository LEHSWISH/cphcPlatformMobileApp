import {all} from 'redux-saga/effects';
import authSagaRoot from './authSagas';
import yatriSagas from './yatriSagas';

export default function* rootSaga() {
  yield all([authSagaRoot(), yatriSagas()]);
}
