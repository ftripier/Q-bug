import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import circuitSaga from './circuit';
import rootReducer from '../../reducer';
import { createSocketConnection } from '../../../api/socket';
import { GroversQuilSource } from '../../../testing/fixtures/groversAlgorithm';
import { getCircuit, getGates, getGateDefs } from '../selectors/circuit';
import { initializeApplication } from '../../actionCreators';

function createMockSocket(socketData: string) {
  const mockSocket = {
    // expected to be overwritten in the saga
    onmessage: ({ data }: { data: string }) => {}
  };
  setTimeout(() => mockSocket.onmessage({ data: socketData }), 10);
  return mockSocket;
}

async function createCircuitState(quilSource: string) {
  const { storeState } = await expectSaga(circuitSaga)
    .withReducer(rootReducer)
    .provide([[call(createSocketConnection), createMockSocket(quilSource)]])
    .dispatch(initializeApplication())
    .run();
  return storeState;
}

describe('circuit data saga', () => {
  it('stores a circuit', async () => {
    const storeState = await createCircuitState(GroversQuilSource);
    expect(getCircuit(storeState)).toBeTruthy();
  });
  it('stores all the circuit gates with targeted qubits in sorted order', async () => {
    const storeState = await createCircuitState(GroversQuilSource);
    const gates = getGates(storeState);
    for (let i = 0; i < gates.length; i += 1) {
      const { qubits } = gates[i];
      for (let j = 1; j < qubits.length; j += 1) {
        expect(qubits[j] > qubits[j - 1]);
      }
    }
  });
  it('stores all the circuit gate definitions with parsed matrices', async () => {
    const storeState = await createCircuitState(GroversQuilSource);
    let gateDefs = getGateDefs(storeState);

    for (let i = 0; i < gateDefs.length; i += 1) {
      const { matrix } = gateDefs[i];
      for (let j = 0; j < matrix.length; j += 1) {
        const row = matrix[j];
        for (let k = 0; k < row.length; k += 1) {
          expect(!isNaN(row[k])).toBeTruthy();
        }
      }
    }
  });
});
