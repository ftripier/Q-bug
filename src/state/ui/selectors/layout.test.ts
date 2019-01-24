import groversAlgorithm from '../../../testing/fixtures/groversAlgorithm';
import rootReducer, { initialState } from '../../reducer';
import circuitLayoutConfig from '../../../components/circuit/circuitLayoutConfig';
import { setCircuitState, setWindowSize } from '../../actionCreators';
import { getCircuitLayout, getWindowSize } from './layout';
import { circuit } from '../../data/types';

const STANDARD_WINDOW = [1440, 600];

const prepareCircuitState = (circuit: circuit, size: number[]) => {
  let state = rootReducer(initialState, setCircuitState(circuit));
  state = rootReducer(state, setWindowSize(size));
  return state;
};

interface BoundingBox {
  top: number;
  left: number;
  height: number;
  width: number;
}

const COLLISIONS: { [key: number]: string } = {
  0: 'NO COLLISION',
  1: 'TOP LEFT CORNER',
  2: 'TOP RIGHT CORNER',
  3: 'TOP SIDE',
  4: 'BOTTOM LEFT CORNER',
  5: 'LEFT SIDE',
  8: 'BOTTOM RIGHT CORNER',
  10: 'RIGHT SIDE',
  12: 'BOTTOM SIDE',
  15: 'COMPLETELY COVERED',
  16: 'COMPLETELY COVERING'
};

const boundingBoxOverlap = (a: BoundingBox, b: BoundingBox): string => {
  const aBB = {
    ...a,
    right: a.left + a.width,
    bottom: a.top + a.height
  };
  const bBB = {
    ...b,
    right: b.left + b.width,
    bottom: b.top + b.height
  };

  const topInB = aBB.top >= bBB.top && aBB.top <= bBB.bottom;
  const rightInB = aBB.right >= bBB.left && aBB.right <= bBB.right;
  const bottomInB = aBB.bottom >= bBB.top && aBB.bottom <= bBB.bottom;
  const leftInB = aBB.left >= bBB.left && aBB.left <= bBB.right;

  let collisionMask = 0;
  if (leftInB && topInB) collisionMask = collisionMask | 1;
  if (rightInB && topInB) collisionMask = collisionMask | 2;
  if (leftInB && bottomInB) collisionMask = collisionMask | 4;
  if (rightInB && bottomInB) collisionMask = collisionMask | 8;
  if (
    aBB.top < bBB.top &&
    aBB.bottom > bBB.bottom &&
    aBB.left < bBB.left &&
    aBB.right > bBB.right
  ) {
    collisionMask = 16;
  }

  return COLLISIONS[collisionMask];
};

describe('boundingBoxOverlap', () => {
  it('detects overlaps correctly', () => {
    const boxA = {
      top: 50,
      left: 50,
      height: 50,
      width: 50
    };

    const collisions: { [key: string]: BoundingBox } = {
      'NO COLLISION': {
        top: 150,
        left: 150,
        height: 50,
        width: 50
      },
      'TOP LEFT CORNER': {
        top: 25,
        left: 10,
        height: 50,
        width: 50
      },
      'TOP RIGHT CORNER': {
        top: 25,
        left: 80,
        height: 50,
        width: 50
      },
      'TOP SIDE': {
        top: 25,
        left: 50,
        height: 50,
        width: 50
      },
      'BOTTOM LEFT CORNER': {
        top: 80,
        left: 20,
        height: 50,
        width: 50
      },
      'LEFT SIDE': {
        top: 50,
        left: 25,
        height: 50,
        width: 50
      },
      'BOTTOM RIGHT CORNER': {
        top: 80,
        left: 80,
        height: 50,
        width: 50
      },
      'RIGHT SIDE': {
        top: 50,
        left: 80,
        height: 50,
        width: 50
      },
      'BOTTOM SIDE': {
        top: 80,
        left: 50,
        height: 50,
        width: 50
      },
      'COMPLETELY COVERED': {
        top: 0,
        left: 0,
        height: 200,
        width: 200
      },
      'COMPLETELY COVERING': {
        top: 75,
        left: 75,
        height: 10,
        width: 10
      }
    };

    const cases = Object.keys(collisions);
    for (let i = 0; i < cases.length; i += 1) {
      const collisionCase = cases[i];
      const caseBox = collisions[collisionCase];
      expect(boundingBoxOverlap(boxA, caseBox)).toEqual(collisionCase);
    }
  });
});

const horizontalRayBoxIntersection = (ray: number, box: BoundingBox) => {
  return ray >= box.top && ray <= box.top + box.height;
};

describe('getWindowSize', () => {
  it('gets the window size', () => {
    const state = rootReducer(initialState, setWindowSize(STANDARD_WINDOW));
    expect(getWindowSize(state)).toEqual(STANDARD_WINDOW);
  });
});

describe('getCircuitLayout', () => {
  it('returns something', () => {
    expect(getCircuitLayout(prepareCircuitState(groversAlgorithm, STANDARD_WINDOW))).toBeTruthy();
  });

  describe('wire layout', () => {
    it('lays out the middle wire in the center of the window for an uneven amount of qubits', () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      expect(getCircuitLayout(state).wires[1].top).toEqual(STANDARD_WINDOW[1] >> 1);
    });

    it("lays out qubits such that there is at least half the layout configuration's wire height and margin worth of space between them", () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      const { wires } = getCircuitLayout(state);
      for (let i = 1; i < wires.length; i += 1) {
        expect(wires[i].top - wires[i - 1].top).toBeGreaterThanOrEqual(
          (circuitLayoutConfig.wire.height >> 1) + circuitLayoutConfig.wire.margin
        );
      }
    });

    it('has positive values for position and size of wires', () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      const { wires } = getCircuitLayout(state);
      for (let i = 0; i < wires.length; i += 1) {
        const { top, left, width } = wires[i];
        expect(top).toBeGreaterThanOrEqual(0);
        expect(left).toBeGreaterThanOrEqual(0);
        expect(width).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('gate layout', () => {
    it('lays out gates such that no gate overlaps with another gate', () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      const { gates } = getCircuitLayout(state);
      gates.sort((a, b) => a.left - b.left);
      for (let i = 0; i < gates.length; i += 1) {
        const a = gates[i];
        for (let j = i + 1; j < gates.length; j += 1) {
          const b = gates[j];
          expect(boundingBoxOverlap(a, b)).toEqual('NO COLLISION');
        }
      }
    });

    it("lays out gates such that they cover all the qubit wires they're supposed to", () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      const { gates, wires } = getCircuitLayout(state);
      for (let i = 0; i < gates.length; i += 1) {
        const gate = gates[i];
        for (let j = 0; j < gate.qubits.length; j += 1) {
          const wire = wires[gate.qubits[j]];
          expect(horizontalRayBoxIntersection(wire.top, gate)).toBeTruthy();
        }
      }
    });

    it('has a positive value for position and size of gates', () => {
      const state = prepareCircuitState(groversAlgorithm, STANDARD_WINDOW);
      const { gates } = getCircuitLayout(state);
      for (let i = 0; i < gates.length; i += 1) {
        const { top, left, width, height } = gates[i];
        expect(top).toBeGreaterThanOrEqual(0);
        expect(left).toBeGreaterThanOrEqual(0);
        expect(width).toBeGreaterThanOrEqual(0);
        expect(height).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
