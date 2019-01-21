export interface DataState {
  circuit: any[];
}

export interface CircuitGate {
  type: 'GATE';
  name: string;
  params?: number[];
  qubits: number[];
}

export interface Expression {
  type: 'EXPRESSION';
  expression: string;
}
