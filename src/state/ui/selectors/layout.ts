import { createSelector } from 'reselect';
import { getNumberOfQubits, getGateColumns, getWireSegments } from '../../data/selectors/circuit';
import circuitLayoutConfig from '../../../components/circuit/circuitLayoutConfig';
import { AppState } from '../../types';
import { WireLayout, GateLayout, WireSegmentLayout } from '../types';
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
      width: windowSize[0] - padding.right - padding.left
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
        let left =
          (columnIndex + 1) * circuitLayoutConfig.gate.margin.left +
          columnIndex * circuitLayoutConfig.gate.width;

        let top = 0;
        let height = 0;
        if (gate.sparse) {
          const bottomQubit = gate.qubits[gate.qubits.length - 1];
          left += wiresLayout[bottomQubit].left;
          top = wiresLayout[bottomQubit].top - (circuitLayoutConfig.wire.height >> 1);
          height = circuitLayoutConfig.wire.height;
        } else {
          const topQubit = gate.qubits[0];
          const bottomQubit = gate.qubits[gate.qubits.length - 1];
          left += wiresLayout[topQubit].left;
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
  gateLayouts: GateLayout[]
) => {
  // grouping gate layouts by the qubit wires they reside on
  const qubitGates = [] as GateLayout[][];
  const wireSegmentLayouts = [] as WireSegmentLayout[][];
  for (let i = 0; i < wireSegmentState.length; i += 1) {
    qubitGates[i] = [];
    wireSegmentLayouts[i] = [];
  }
  for (let i = 0; i < gateLayouts.length; i += 1) {
    const { wireMask } = gateLayouts[i];
    for (let q = 0; q < wireSegmentState.length; q += 1) {
      if (wireMask & (1 << q)) {
        qubitGates[q].push(gateLayouts[i]);
      }
    }
  }

  // for each qubit wire, lay out a wire until it intersects the next gate
  for (let i = 0; i < wireSegmentState.length; i += 1) {
    const qubitWireSegments = wireSegmentState[i];
    const gateQueue = qubitGates[i];
    const qubitWireSegmentLayouts = wireSegmentLayouts[i];
    const { top, left: wireLeft, width } = wires[i];
    let left = wireLeft;
    let right = wireLeft + width;
    for (let j = 0; j < qubitWireSegments.length; j += 1) {
      const wireSegment = qubitWireSegmentLayouts[j];
      const nextGate = gateQueue.shift();
      if (nextGate) {
        right = nextGate.left;
        qubitWireSegmentLayouts.push({ ...wireSegment, top, left, width: right - left });
        left = nextGate.left + nextGate.width;
      } else {
        right = wireLeft + width;
        qubitWireSegmentLayouts.push({ ...wireSegment, top, left, width: right - left });
      }
    }
  }
  const flattened = wireSegmentLayouts.reduce(
    (flat, wireSegments) => flat.concat(wireSegments),
    []
  );
  return flattened;
};

export const getCircuitLayout = createSelector(
  [getWindowSize, getGateColumns, getNumberOfQubits, getWireSegments],
  (windowSize, gateColumns, numberOfQubits, wireSegmentState) => {
    const wires = getWiresLayout(windowSize, numberOfQubits);
    const gates = getGatesLayout(wires, gateColumns);
    const wireSegments = getWireSegmentsLayout(wireSegmentState, wires, gates);
    return {
      wires,
      gates,
      wireSegments
    };
  }
);
