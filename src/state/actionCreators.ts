import * as types from './constants';
import { WireSegmentLayout } from './ui/types';
import { WireSegmentID } from './data/types';

export interface Action {
  type: string;
  payload?: {
    [key: string]: any;
  };
}

export const initializeApplication = (): Action => ({ type: types.INITIALIZE_APPLICATION });

export const setCircuitState = (circuit: any): Action => ({
  type: types.SET_CIRCUIT_STATE,
  payload: { circuit }
});

export const setWindowSize = (size: number[]): Action => ({
  type: types.SET_WINDOW_SIZE,
  payload: { size }
});

export const openWireSegmentTooltip = (id: WireSegmentID): Action => ({
  type: types.OPEN_WIRE_SEGMENT_TOOLTIP,
  payload: {
    id
  }
});

export const closeWireSegmentTooltip = (id: WireSegmentID): Action => ({
  type: types.CLOSE_WIRE_SEGMENT_TOOLTIP,
  payload: {
    id
  }
});
