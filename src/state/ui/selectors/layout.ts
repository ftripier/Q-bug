import { createSelector } from 'reselect';
import { getNumberOfQubits, getGateColumns, getWireSegments } from '../../data/selectors/circuit';
import circuitLayoutConfig from '../../../components/circuit/circuitLayoutConfig';
import { AppState } from '../../types';
import { WireLayout, GateLayout } from '../types';
import { GateColumn, WireSegment } from '../../data/types';

const getLayoutState = (state: AppState) => state.ui.layout;

export const getWindowSize = createSelector(
  getLayoutState,
  ({ windowSize }) => windowSize
);

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

const getGatesLayout = (wiresLayout: WireLayout[], columns: GateColumn[]): GateLayout[] => {
  const laidOut = columns.reduce(
    (gates: GateLayout[], column: GateColumn, columnIndex: number): GateLayout[] => {
      const newGates = [];
      for (let i = 0; i < column.gates.length; i += 1) {
        const gate = column.gates[i];
        const left =
          (columnIndex + 1) * circuitLayoutConfig.gate.margin.left +
          columnIndex * circuitLayoutConfig.gate.width;

        let top = 0;
        let height = 0;
        if (gate.sparse) {
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
          height
        });
      }
      return gates.concat(newGates);
    },
    []
  );

  return laidOut;
};

const getWireSegmentsLayout = (
  wireSegmentState: WireSegment[][],
  wires: WireLayout[],
  gateColumns: GateLayout[]
) => {
  // for each qubit wire, lay out a wire until it intersects the next gate
  // first wire segment is the ground wire
};

export const getCircuitLayout = createSelector(
  [getWindowSize, getGateColumns, getNumberOfQubits, getWireSegments],
  (windowSize, gateColumns, numberOfQubits, wireSegmentState) => {
    const wires = getWiresLayout(windowSize, numberOfQubits);
    const gates = getGatesLayout(wires, gateColumns);
    const wireSegments = getWireSegmentsLayout(wireSegmentState, wires, gates);
    return {
      wires,
      gates
    };
  }
);
