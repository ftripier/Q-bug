import { CircuitGate } from '../state/data/types';

// TODO: use the math.js types
type MixedState = number[][];

interface Simulator {
  applyGate(gate: CircuitGate): void;
  getWavefunctionForQubit(qubit: number): MixedState;
}
