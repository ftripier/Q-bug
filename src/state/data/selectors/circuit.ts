import { createSelector } from 'reselect';
import { AppState } from '../../types';
import { CIRCUIT_INSTRUCTION_TYPES } from '../reducers/circuit';

export const getCircuit = (state: AppState) => state.data.circuit;
export const getGates = createSelector(
  getCircuit,
  (circuit: any[]) => circuit.filter(inst => inst.type === CIRCUIT_INSTRUCTION_TYPES.GATE)
);
export const getGateDefs = createSelector(
  getCircuit,
  (circuit: any[]) => circuit.filter(inst => inst.type === CIRCUIT_INSTRUCTION_TYPES.DEFGATE)
);
