import groversAlgorithm from '../../../../testing/fixtures/groversAlgorithm';
import rootReducer, { initialState } from '../../reducer';
import circuitLayoutConfig from '../../../components/circuit/circuitLayoutConfig';
import { setCircuitState, setWindowSize } from '../../actionCreators';
import { getCircuitLayout } from './layout';

const STANADARD_WINDOW = [1440, 600];

const prepareCircuitState = (circuit: any[], size: number[]) => {
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
  15: 'COMPLETELY COVERED'
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
  if (leftInB && topInB) collisionMask = collisionMask & 1;
  if (rightInB && topInB) collisionMask = collisionMask & 2;
  if (leftInB && bottomInB) collisionMask = collisionMask & 4;
  if (rightInB && bottomInB) collisionMask = collisionMask & 8;
  return COLLISIONS[collisionMask];
};

describe('getCircuitLayout', () => {
  it('returns something', () => {
    expect(getCircuitLayout(prepareCircuitState(groversAlgorithm, STANADARD_WINDOW))).toBeTruthy();
  });

  it('returns the number of qubits in the circuit', () => {
    const state = prepareCircuitState(groversAlgorithm, STANADARD_WINDOW);
    expect(getCircuitLayout(state).numberOfQubits).toBe(3);
  });

  describe('wire layout', () => {
    it('lays out the middle wire in the center of the window for an uneven amount of qubits', () => {
      const state = prepareCircuitState(groversAlgorithm, STANADARD_WINDOW);
      expect(getCircuitLayout(state).wires[1].top).toEqual(STANADARD_WINDOW[1] >> 1);
    });

    it("lays out qubits such that there is at least half the layout configuration's wire height and margin worth of space between them", () => {
      const state = prepareCircuitState(groversAlgorithm, STANADARD_WINDOW);
      const { wires } = getCircuitLayout(state);
      for (let i = 1; i < wires.length; i += 1) {
        expect(wires[i].top - wires[i - 1].top).toBeGreaterThanOrEqual(
          (circuitLayoutConfig.wire.height >> 1) + circuitLayoutConfig.wire.margin
        );
      }
    });
  });

  describe('gate layout', () => {
    it('lays out gates such that no gate overlaps with another gate', () => {
      const state = prepareCircuitState(groversAlgorithm, STANADARD_WINDOW);
      const { gates } = getCircuitLayout(state);
      gates.sort((a, b) => a.left - b.left);
      for (let i = 0; i < gates.length; i += 1) {
        const a = gates[i];
        for (let j = i + 1; j < gates.length; j += 1) {
          const b = gates[i];
          expect(boundingBoxOverlap(a, b)).toEqual('NO COLLISION');
        }
      }
    });
  });
});
