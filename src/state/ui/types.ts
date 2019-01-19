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

export interface GateLayout {
  top: number;
  left: number;
  width: number;
  height: number;
  sparse: boolean;
  qubits: number[];
}
