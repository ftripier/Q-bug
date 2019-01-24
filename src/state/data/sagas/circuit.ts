import { take, call, put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { INITIALIZE_APPLICATION } from '../../constants';
import { createSocketConnection } from '../../../api/socket';
import { setCircuitState } from '../../actionCreators';
import { parseQuilProgram } from '../../../api/circuits';

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

function* processNewCircuit(payload: any) {
  const converted = yield call(parseQuilProgram, payload);
  yield put(setCircuitState(converted));
}

export default function* readCircuitSaga() {
  yield take(INITIALIZE_APPLICATION);
  let socket;
  try {
    socket = yield call(createSocketConnection);
  } catch (e) {
    console.error(e);
    return;
  }

  const socketChannel = yield call(createSocketChannel, socket);

  yield takeLatest(socketChannel, processNewCircuit);
}
