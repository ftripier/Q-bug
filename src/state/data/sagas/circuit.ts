import { take, call, put, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import quilToJSON from 'quil-json-js';
import { INITIALIZE_APPLICATION } from '../../constants';
import { createSocketConnection } from '../../../api/socket';
import { setCircuitState } from '../../actionCreators';
import { CIRCUIT_INSTRUCTION_TYPES } from '../reducers/circuit';

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

function sortQubits(circuit: any[]) {
  const gates = circuit.filter(({ type }) => type === CIRCUIT_INSTRUCTION_TYPES.GATE);
  gates.forEach(gate => gate.qubits.sort());
}

function* processNewCircuit(payload: any) {
  const converted = yield call(quilToJSON, payload);
  sortQubits(converted);
  yield put(setCircuitState(converted));
}

export default function* readCircuitSaga() {
  yield take(INITIALIZE_APPLICATION);
  const socket = yield call(createSocketConnection);
  const socketChannel = yield call(createSocketChannel, socket);

  yield takeLatest(socketChannel, processNewCircuit);
}
