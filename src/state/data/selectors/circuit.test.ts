import groversAlgorithm from '../../../testing/fixtures/groversAlgorithm';
import rootReducer, { initialState } from '../../reducer';
import { setCircuitState } from '../../actionCreators';
import {
  getGateDefMatrices,
  getGatesWithMatrices,
  getGateColumns,
  getNumberOfQubits,
  getWireSegments
} from './circuit';
import standardGates from '../../../simulator/standardGates';
import { circuit } from '../types';

const prepareCircuitState = (circuit: circuit) => {
  let state = rootReducer(initialState, setCircuitState(circuit));
  return state;
};

describe('getGateDefMatrices', () => {
  it('should return a map of defined gate names to their matrices', () => {
    const state = prepareCircuitState(groversAlgorithm);
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
  it('should return circuit gates with their sparsity and respective matrix', () => {
    const state = prepareCircuitState(groversAlgorithm);
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
  it('should return gates in columns whereby no subset of gates in each column affects the same qubit', () => {
    const state = prepareCircuitState(groversAlgorithm);
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
  it('should return the number total number of qubits affected in the circuit', () => {
    const state = prepareCircuitState(groversAlgorithm);
    expect(getNumberOfQubits(state)).toEqual(3);
  });
});

describe('getWireSegments', () => {
  it("should return the correct probabilities for each wire segment in the grover's algorithm circuit", () => {
    const state = prepareCircuitState(groversAlgorithm);
    const wireSegments = getWireSegments(state);
    const numberOfQubits = getNumberOfQubits(state);
    const columns = getGateColumns(state);

    expect(wireSegments.length).toEqual(numberOfQubits);
    for (let i = 0; i < wireSegments.length; i += 1) {
      const qubitWires = wireSegments[i];
      // equal to the amount of columns (in grovers, all of which are dense) plus the initial wire segment
      expect(qubitWires.length).toEqual(columns.length + 1);
      expect(qubitWires[0].probabilityZero).toBe(0);
      if (i === wireSegments.length >> 1) {
        expect(qubitWires[qubitWires.length - 1].probabilityZero).toBeLessThanOrEqual(0.1);
      } else {
        expect(qubitWires[qubitWires.length - 1].probabilityZero).toBeGreaterThanOrEqual(0.9);
      }
    }
  });
});
