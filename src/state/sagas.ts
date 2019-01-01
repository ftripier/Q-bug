import { all } from 'redux-saga/effects';
import dataSagas from './data/sagas';
import uiSagas from './ui/sagas';

export default function* rootSaga() {
  yield all([...dataSagas, ...uiSagas]);
}
