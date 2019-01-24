import groversAlgorithm, { GroversQuilSource } from '../../../testing/fixtures/groversAlgorithm';
import rootReducer from '../../reducer';
import { initializeApplication } from '../../actionCreators';
import {
  getGateDefMatrices,
  getGatesWithMatrices,
  getGateColumns,
  getNumberOfQubits,
  getWireSegments
} from './circuit';
import { expectSaga } from 'redux-saga-test-plan';
import readCircuitSaga from '../sagas/circuit';
import { createSocketConnection } from '../../../api/socket';
import { call } from 'redux-saga/effects';
import standardGates from '../../../simulator/standardGates';

function createMockSocket(socketData: string) {
  const mockSocket = {
    // expected to be overwritten in the saga
    onmessage: ({ data }: { data: string }) => {}
  };
  setTimeout(() => mockSocket.onmessage({ data: socketData }), 10);
  return mockSocket;
}

async function createCircuitState(quilSource: string) {
  const { storeState } = await expectSaga(readCircuitSaga)
    .withReducer(rootReducer)
    .provide([[call(createSocketConnection), createMockSocket(quilSource)]])
    .dispatch(initializeApplication())
    .run();
  return storeState;
}

describe('getGateDefMatrices', () => {
  it('should return a map of defined gate names to their matrices', async () => {
    const state = await createCircuitState(GroversQuilSource);
    const gateDefs = getGateDefMatrices(state);
    expect(Object.keys(gateDefs)).toEqual(['GROVER_ORACLE', 'HADAMARD_DIFFUSION']);
    expect(gateDefs['GROVER_ORACLE']).toBeTruthy();
    expect(gateDefs['GROVER_ORACLE'].toJSON().data).toEqual([
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1]
    ]);
    expect(gateDefs['HADAMARD_DIFFUSION']).toBeTruthy();
    expect(gateDefs['HADAMARD_DIFFUSION'].toJSON().data).toEqual([
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, 0],
      [0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0],
      [0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, -1, 0],
      [0, 0, 0, 0, 0, 0, 0, -1]
    ]);
  });
});

describe('getGatesWithMatrices', () => {
  it('should return circuit gates with their sparsity and respective matrix', async () => {
    const state = await createCircuitState(GroversQuilSource);
    const gates = getGatesWithMatrices(state);
    const gateDefs = getGateDefMatrices(state);
    for (let i = 0; i < gates.length; i += 1) {
      const gate = gates[i];
      expect(gate.sparse).toBeFalsy();
      if (gateDefs[gate.name]) {
        expect(gate.matrix.toString()).toEqual(gateDefs[gate.name].toString());
      } else {
        expect(gate.matrix.toString()).toEqual(standardGates[gate.name].toString());
      }
    }
  });
});

describe('getGateColumns', () => {
  it('should return gates in columns whereby no subset of gates in each column affects the same qubit', async () => {
    const state = await createCircuitState(GroversQuilSource);
    const gateColumns = getGateColumns(state);

    for (let i = 0; i < gateColumns.length; i += 1) {
      const collisionMap = { 0: false, 1: false, 2: false } as { [key: number]: boolean };
      const { gates } = gateColumns[i];
      for (let j = 0; j < gates.length; j += 1) {
        const gate = gates[j];
        gate.qubits.forEach(qubit => {
          expect(collisionMap[qubit]).toBeFalsy();
          collisionMap[qubit] = true;
        });
      }
    }
  });
});

describe('getNumberOfQubits', () => {
  it('should return the number total number of qubits affected in the circuit', async () => {
    const state = await createCircuitState(GroversQuilSource);
    expect(getNumberOfQubits(state)).toEqual(3);
  });
});

describe('getWireSegments', () => {
  it("should return the correct probabilities for each wire segment in the grover's algorithm circuit", async () => {
    const state = await createCircuitState(GroversQuilSource);
    const wireSegments = getWireSegments(state);
    const numberOfQubits = getNumberOfQubits(state);
    const columns = getGateColumns(state);

    expect(wireSegments.length).toEqual(numberOfQubits);
    for (let i = 0; i < wireSegments.length; i += 1) {
      const qubitWires = wireSegments[i];
      expect(qubitWires.length).toEqual(columns.length);
      if (i === wireSegments.length >> 1) {
        expect(qubitWires[qubitWires.length - 1].probabilityZero).toBeLessThanOrEqual(0.1);
      } else {
        expect(qubitWires[qubitWires.length - 1].probabilityZero).toBeGreaterThanOrEqual(0.9);
      }
    }
  });
});
