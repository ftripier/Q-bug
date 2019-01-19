import groversAlgorithm from '../../../../testing/fixtures/groversAlgorithm';
import rootReducer, { initialState } from '../../reducer';
import { setCircuitState, setWindowSize } from '../../actionCreators';
import { getCircuitLayout } from './layout';

const STANADARD_WINDOW = [1440, 600];

const prepareCircuitState = (circuit: any[], size: number[]) => {
  let state = rootReducer(initialState, setCircuitState(circuit));
  state = rootReducer(state, setWindowSize(size));
  return state;
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
  });
});
