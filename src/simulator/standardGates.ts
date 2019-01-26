import math, { Matrix } from 'mathjs';

export default {
  H: math.matrix([[1 / math.sqrt(2), 1 / math.sqrt(2)], [1 / math.sqrt(2), -1 / math.sqrt(2)]]),
  PROJECT_TO_ZERO: math.matrix([[1, 0], [0, 0]]),
  SWAP: math.matrix([[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]]),
  CNOT: math.matrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]]),
  X: math.matrix([[0, 1], [1, 0]])
} as { [key: string]: Matrix };
