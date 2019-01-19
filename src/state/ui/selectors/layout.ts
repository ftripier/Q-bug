import { createSelector } from 'reselect';
import { getCircuit } from '../../data/selectors/circuit';
import circuitLayoutConfig from '../../../components/circuit/circuitLayoutConfig';
import { CIRCUIT_INSTRUCTION_TYPES } from '../../data/reducers/circuit';
import { AppState } from '../../types';
import { WireLayout, GateLayout } from '../types';
import { CircuitGate } from '../../data/types';

const getLayoutState = (state: AppState) => state.ui.layout;

export const getWindowSize = createSelector(
  getLayoutState,
  ({ windowSize }) => windowSize
);

const getNumberOfQubits = (circuit: any[]) => {
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

const getWiresLayout = (windowSize: number[], numberOfQubits: number): WireLayout[] => {
  const { padding, wire } = circuitLayoutConfig;
  const windowMidHeight = windowSize[1] >> 1;
  const midIndex = numberOfQubits >> 1;
  const wireHeight = wire.height + wire.margin;
  // if we have an even number of qubits, we want the midpoint of the window the sit
  // between the middle two qubit wires.
  const parityOffset = numberOfQubits % 2 === 0 ? -(wireHeight >> 1) : 0;

  const wires = [];
  for (let i = 0; i < numberOfQubits; i += 1) {
    const indexDifference = midIndex - i;
    wires.push({
      // each wire is offset from the midpoint of the window, lengthwise, so that
      // each gate intersects the wire at the gate's midpoint.
      top:
        // the midpoint of the window
        windowMidHeight -
        // the wire's offset from the middle wire
        indexDifference * wireHeight +
        // ensures the wire intersects gates at the midpoint
        parityOffset,
      left: padding.left,
      width: windowSize[0] - padding.right
    });
  }
  return wires;
};

// determines if a gate is sparse - that is, if the qubits
// it affects don't form a continuous block
const isSparse = (qubits: number[]): boolean => {
  for (let i = 1; i < qubits.length; i += 1) {
    const qubit = qubits[i];
    if (qubits[i - 1] != qubit - 1) {
      return true;
    }
  }
  return false;
};

interface GateWithMask extends CircuitGate {
  wireMask: number;
}

interface GateColumn {
  gates: GateWithMask[];
  wireMask: number;
}

const getGatesLayout = (wiresLayout: WireLayout[], gates: CircuitGate[]): GateLayout[] => {
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

  return columns.reduce(
    (gates: GateLayout[], column: GateColumn, columnIndex: number): GateLayout[] => {
      const newGates = [];
      for (let i = 0; i < column.gates.length; i += 1) {
        const gate = column.gates[i];
        const left =
          (columnIndex + 1) * circuitLayoutConfig.gate.margin.left +
          columnIndex * circuitLayoutConfig.gate.width;
        const sparse = isSparse(gate.qubits);
        let top = 0;
        let height = 0;
        if (sparse) {
          const bottomQubit = gate.qubits[gate.qubits.length - 1];
          top = wiresLayout[bottomQubit].top - (circuitLayoutConfig.wire.height >> 1);
          height = circuitLayoutConfig.wire.height;
        } else {
          const topQubit = gate.qubits[0];
          const bottomQubit = gate.qubits[gate.qubits.length - 1];
          top = wiresLayout[topQubit].top - (circuitLayoutConfig.wire.height >> 1);
          let bottom = wiresLayout[bottomQubit].top + (circuitLayoutConfig.wire.height >> 1);
          height = bottom - top;
        }
        newGates.push({
          ...gate,
          top,
          left,
          width: circuitLayoutConfig.gate.width,
          height,
          sparse
        });
      }
      return gates.concat(newGates);
    },
    []
  );
};

export const getCircuitLayout = createSelector(
  [getWindowSize, getCircuit],
  (windowSize, circuit) => {
    const numberOfQubits = getNumberOfQubits(circuit);
    const wires = getWiresLayout(windowSize, numberOfQubits);
    const gateInstrs = circuit.filter(({ type }) => type === CIRCUIT_INSTRUCTION_TYPES.GATE);
    const gates = getGatesLayout(wires, gateInstrs);
    return {
      numberOfQubits,
      wires,
      gates
    };
  }
);
