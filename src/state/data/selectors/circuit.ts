import { createSelector } from 'reselect';
import { AppState } from '../../types';
import { CIRCUIT_INSTRUCTION_TYPES } from '../reducers/circuit';
import { CircuitGate, CircuitGateDef, GateWithMatrix, GateColumn, GateWithMask } from '../types';
import { Matrix } from 'mathjs';
import standardGates from '../../../simulator/standardGates';

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

export const isSparse = (gate: CircuitGate) => {
  const { qubits } = gate;

  for (let i = 1; i < qubits.length; i += 1) {
    const qubit = qubits[i];
    if (qubits[i - 1] != qubit - 1) {
      return true;
    }
  }
  return false;
};

export const getGates = createSelector(
  getCircuit,
  filterGates
);

export const getGateDefs = createSelector(
  getCircuit,
  filterDefGates
);

export const getGateDefMatrices = createSelector(
  getGateDefs,
  (gateDefs: CircuitGateDef[]): { [key: string]: Matrix } => {
    const gateDefMatrices = {} as { [key: string]: Matrix };
    for (let i = 0; i < gateDefs.length; i += 1) {
      const { name, matrix } = gateDefs[i];
      gateDefMatrices[name] = matrix;
    }
    return gateDefMatrices;
  }
);

export const getGatesWithMatrices = createSelector(
  [getGates, getGateDefMatrices],
  (gates: CircuitGate[], gateDefs: { [key: string]: Matrix }): GateWithMatrix[] =>
    gates.map(gate => ({
      ...gate,
      sparse: isSparse(gate),
      matrix: gateDefs[gate.name] ? gateDefs[gate.name] : standardGates[gate.name]
    }))
);

export const getGateColumns = createSelector(
  getGatesWithMatrices,
  (gates: GateWithMatrix[]): GateColumn[] => {
    const gateWithMasks = gates.map(gate => ({
      ...gate,
      wireMask: gate.qubits.reduce((mask, qubit) => mask | (1 << qubit), 0)
    }));
    // Here we fold over gates, keeping a track over which wires are occupied by a
    // gate. Once all wires on a given column are occupied, we find a new column to add the gate to.
    //
    // Right now, we use bitmasks to represent which wires are occupied (a 1 in the qubit wire's column)
    // which means if anyone tries to use more than 32 qubits, this algorithm blows up.
    // Thankfully, simulating 32 qubits is too much for the simulator anyways.
    const columns = gateWithMasks.reduce(
      (columns: GateColumn[], gate: GateWithMask): GateColumn[] => {
        const { wireMask } = gate;
        const columnThatGateFitsInto = columns.find(
          ({ wireMask: columnWireMask }) => !(columnWireMask & wireMask)
        );
        if (!columnThatGateFitsInto) {
          return columns.concat({ gates: [gate], wireMask });
        }
        columnThatGateFitsInto.gates.push(gate);
        columnThatGateFitsInto.wireMask = columnThatGateFitsInto.wireMask | wireMask;
        return columns;
      },
      []
    );

    return columns;
  }
);

export const getNumberOfQubits = createSelector(
  getCircuit,
  reduceNumberOfQubits
);
