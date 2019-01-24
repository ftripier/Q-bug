import { Matrix } from 'mathjs';

export type circuit = any[];

export interface DataState {
  circuit: circuit;
}

export interface CircuitGate {
  type: 'GATE';
  name: string;
  params?: number[];
  qubits: number[];
}

export interface GateWithMatrix extends CircuitGate {
  matrix: Matrix;
  sparse: boolean;
}

export interface GateWithMask extends GateWithMatrix {
  wireMask: number;
}

export interface GateColumn {
  gates: GateWithMask[];
  wireMask: number;
}

export interface WireSegment {
  probabilityZero: number;
  qubit: number;
}

export interface CircuitGateDef {
  type: 'DEFGATE';
  name: string;
  variables: number[];
  matrix: Matrix;
}

export interface Expression {
  type: 'EXPRESSION';
  expression: string;
}
