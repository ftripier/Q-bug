import { take, call, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import quilToJSON from 'quil-json-js';
import { INITIALIZE_APPLICATION } from '../../constants';
import { createSocketConnection } from '../../../api/socket';
import { setCircuitState } from '../../actionCreators';

function createSocketChannel(socket: WebSocket) {
  return eventChannel(emit => {
    socket.onmessage = event => {
      emit(event.data);
    };

    const unsubscribe = () => {
      socket.onmessage = null;
    };

    return unsubscribe;
  });
}

export default function* readCircuitSaga() {
  yield take(INITIALIZE_APPLICATION);
  const socket = yield call(createSocketConnection);
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    const payload = yield take(socketChannel);
    const converted = yield call(quilToJSON, payload);
    yield put(setCircuitState(converted));
  }
}
