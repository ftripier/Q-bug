import { createSelector } from 'reselect';
import { AppState } from '../../types';
import { CIRCUIT_INSTRUCTION_TYPES } from '../reducers/circuit';

export const getCircuit = (state: AppState) => state.data.circuit;

export const filterGates = (circuit: any[]) =>
  circuit.filter(instr => instr.type === CIRCUIT_INSTRUCTION_TYPES.GATE);

export const filterDefGates = (circuit: any[]) =>
  circuit.filter(inst => inst.type === CIRCUIT_INSTRUCTION_TYPES.DEFGATE);

export const reduceNumberOfQubits = (circuit: any[]) => {
  let maxQubits = 0;
  circuit.forEach(
    gate =>
      gate.qubits &&
      gate.qubits.forEach((qubit: number) => {
        maxQubits = Math.max(maxQubits, qubit);
      })
  );
  return maxQubits + 1;
};

export const getGates = createSelector(
  getCircuit,
  filterGates
);
export const getGateDefs = createSelector(
  getCircuit,
  filterDefGates
);

export const getNumberOfQubits = createSelector(
  getCircuit,
  reduceNumberOfQubits
);
