import { CircuitGate } from '../data/types';

export interface UIState {
  layout: {
    windowSize: number[];
  };
}

export interface WireLayout {
  top: number;
  left: number;
  width: number;
}

export interface GateLayout extends CircuitGate {
  top: number;
  left: number;
  width: number;
  height: number;
  sparse: boolean;
}
