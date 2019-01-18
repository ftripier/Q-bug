import { createSelector } from 'reselect';
import { getCircuit } from '../../data/selectors/circuit';

const getLayoutState = (state: AppState) => state.ui.layout;

export const getWindowSize = createSelector(
  getLayoutState,
  ({ windowSize }) => windowSize
);

export const getCircuitLayout = createSelector(
  [getWindowSize, getCircuit],
  (windowSize, circuit) => {
    // TODO
  }
);
