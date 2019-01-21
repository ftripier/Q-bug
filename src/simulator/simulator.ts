import { CircuitGate } from '../state/data/types';
import math, { Matrix } from 'mathjs';

const PROJECT_TO_ZERO = math.matrix([[1, 0], [0, 0]]);

function identity(size: number): Matrix {
  const mat = math.zeros([size, size], 'sparse') as Matrix;
  for (let i = 0; i < size; i += 1) {
    mat.set([i, i], 1);
  }
  return mat;
}

function trace(matrix: Matrix) {
  const size = matrix.size();
  let result = 0;
  for (let i = 0; i < size[0]; i += 1) {
    result += matrix.get([i, i]);
  }
  return result;
}

function liftedGateMatrix(matrix: Matrix, qubit: number, n: number): Matrix {
  const bottomMatrix = identity(2 ** qubit);
  const gateQubits = math.log2(matrix.size()[0]);
  const topQubits = n - qubit - gateQubits;
  const topMatrix = identity(2 ** topQubits);

  return math.kron(topMatrix, math.kron(matrix, bottomMatrix));
}

// a density operator simulator that implements
// the abstract Simulator interface.
export default class Simulator {
  /**
   * the number of qubits in the simulator
   */
  n: number;
  /**
   * the current state of the circuit, represented by a density matrix
   */
  state: Matrix;
  constructor(numberOfQubits: number) {
    this.n = numberOfQubits;
    this.state = math.zeros([2 ** this.n, 2 ** this.n], 'sparse') as Matrix;
    this.state.set([0, 0], 1);
  }

  applyGate(gate: CircuitGate) {}

  getProbablityZeroForQubit(qubit: number): number {
    const measure0 = liftedGateMatrix(PROJECT_TO_ZERO, qubit, this.n);
    const probZero = trace(math.multiply(measure0, this.state) as Matrix);
    return probZero;
  }
}
