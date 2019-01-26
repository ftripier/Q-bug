import { GateWithMask } from '../state/data/types';
import math, { Matrix } from 'mathjs';
import standardGates from './standardGates';

const { PROJECT_TO_ZERO, SWAP } = standardGates;

function swap(array: Matrix, i: number, j: number) {
  let temp = array.get([i]);
  array.set([i], array.get([j]));
  array.set([j], temp);
}

function identity(size: number): Matrix {
  const mat = math.zeros([size, size], 'sparse') as Matrix;
  for (let i = 0; i < size; i += 1) {
    mat.set([i, i], 1);
  }
  return mat;
}

function ctranspose(mat: Matrix): Matrix {
  const conjugated = mat.map(c => math.conj(c), true) as Matrix;
  return math.transpose(conjugated) as Matrix;
}

/**
 * Lifts gates that operate on adjacent qubits to a higher dimensional hilbert space.
 *
 * @param matrix the matrix representation of the gate
 * @param qubit the first qubit index the gate operates on
 * @param n the number of qubits in the lifted hilbert space
 *
 * @returns the gate, lifted to operate on the higher dimensional hilbert space
 */
function adjacentLiftedGateMatrix(matrix: Matrix, qubit: number, n: number): Matrix {
  const gateQubits = math.log2(matrix.size()[0]);
  if (n <= gateQubits) {
    return matrix;
  }
  const bottomMatrix = identity(2 ** qubit);
  const topQubits = n - qubit - gateQubits;
  const topMatrix = identity(2 ** topQubits);

  return math.kron(math.kron(bottomMatrix, matrix), topMatrix);
}

function twoSwapHelper(
  j: number,
  k: number,
  n: number,
  indices: Matrix
): { permutationMatrix: Matrix; indexArr: Matrix } {
  let permutationMatrix = identity(2 ** n);
  const indexArr = indices.clone();

  if (j == k) {
    return { permutationMatrix, indexArr };
  } else if (j > k) {
    for (let i = j; i > k; i -= 1) {
      permutationMatrix = math.multiply(
        adjacentLiftedGateMatrix(SWAP, i - 1, n),
        permutationMatrix
      ) as Matrix;
      swap(indexArr, i - 1, i);
    }
  } else if (j < k) {
    for (let i = j; i < k; i += 1) {
      permutationMatrix = math.multiply(
        adjacentLiftedGateMatrix(SWAP, i, n),
        permutationMatrix
      ) as Matrix;
      swap(indexArr, i + 1, i);
    }
  }

  return {
    permutationMatrix,
    indexArr
  };
}

function arbitraryPermutation(
  indices: number[],
  n: number
): { permutationMatrix: Matrix; startIndex: number } {
  let permutationMatrix = identity(2 ** n);

  const sorted = indices.slice().sort();
  const medianIndex = sorted.length >> 1;
  const median = sorted[medianIndex];

  const startIndex = median - medianIndex;
  const finalMap = math.range(startIndex, startIndex + indices.length);

  let indexArr = math.range(0, n);

  let madeIt = false;
  let right = true;
  let pmod;
  while (!madeIt) {
    for (
      let i = right ? 0 : indices.length - 1;
      right ? i < indices.length : i >= 0;
      i += right ? 1 : -1
    ) {
      // two swap helper
      const currIndex = (indexArr.toArray() as number[]).findIndex(index => index === indices[i]);
      ({ permutationMatrix: pmod, indexArr } = twoSwapHelper(
        finalMap.get([i]),
        currIndex,
        n,
        indexArr
      ));

      permutationMatrix = math.multiply(pmod, permutationMatrix) as Matrix;

      const indexArrIndex = math.index(
        math.range(finalMap.get([0]), finalMap.get([finalMap.size()[0] - 1]) + 1)
      );
      if (math.deepEqual(indexArr.subset(indexArrIndex), indices)) {
        madeIt = true;
        break;
      }
    }

    // for next iteration, go in opposite direction
    right = !right;
  }

  return { permutationMatrix, startIndex };
}

/**
 * Like lifted gate matrix, but first permutes the gate's targeted qubit indices into adjacent positions
 * so that the the lifting it is as simple as kronning it with a top and bottom identity matrix
 * for the remainder of the higher dimensional hilbert space. The adjacency permutation is then inverted
 * by applying the transpose.
 *
 * This is only necessary when the gate affects nonadjacent qubits.
 */
function sparseLiftedGateMatrix(matrix: Matrix, qubits: number[], n: number): Matrix {
  const { permutationMatrix, startIndex } = arbitraryPermutation(qubits, n);

  const v = adjacentLiftedGateMatrix(matrix, startIndex, n);
  return math.multiply(
    math.transpose(permutationMatrix) as Matrix,
    math.multiply(v, permutationMatrix) as Matrix
  ) as Matrix;
}

function liftedGateMatrix(gate: GateWithMask, n: number): Matrix {
  let { qubits, matrix, sparse } = gate;

  if (sparse) {
    matrix = sparseLiftedGateMatrix(matrix, qubits, n);
  } else {
    matrix = adjacentLiftedGateMatrix(matrix, qubits[0], n);
  }
  return matrix;
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

  applyGate(gate: GateWithMask) {
    const gateMatrix = liftedGateMatrix(gate, this.n);
    this.state = math.multiply(
      math.multiply(gateMatrix, this.state),
      ctranspose(gateMatrix)
    ) as Matrix;
  }

  getProbablityZeroForQubit(qubit: number): number {
    const measure0 = adjacentLiftedGateMatrix(PROJECT_TO_ZERO, qubit, this.n);
    const probZero = math.trace(math.multiply(measure0, this.state) as Matrix);
    return probZero;
  }
}
