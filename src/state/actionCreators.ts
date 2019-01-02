import { INITIALIZE_APPLICATION, SET_CIRCUIT_STATE, SET_WINDOW_SIZE } from './constants';

export interface Action {
  type: string;
  payload?: {
    [key: string]: any;
  };
}

export const initializeApplication = (): Action => ({ type: INITIALIZE_APPLICATION });

export const setCircuitState = (circuit: any): Action => ({
  type: SET_CIRCUIT_STATE,
  payload: { circuit }
});

export const setWindowSize = (size: number[]): Action => ({
  type: SET_WINDOW_SIZE,
  payload: { size }
});
