import { combineReducers } from 'redux';
import data from './data/reducers';
import ui from './ui/reducers';
import { AppState } from './types';

export default combineReducers({
  ui,
  data
});

export const initialState: AppState = {
  ui: {
    layout: {
      windowSize: [0, 0]
    },
    tooltips: {
      wireSegments: {},
      gates: {}
    }
  },
  data: {
    circuit: []
  }
};
