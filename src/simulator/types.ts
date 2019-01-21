import { CircuitGate } from '../state/data/types';
import { Matrix } from 'mathjs';

type MixedState = Matrix;

interface Simulator {
  applyGate(gate: CircuitGate): void;
  getProbablityZeroForQubit(qubit: number): number;
}
