import { INITIALIZE_APPLICATION, SET_CIRCUIT_STATE } from './constants';

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
