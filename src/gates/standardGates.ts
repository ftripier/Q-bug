import { Qubits } from "./types";
import { Complex, c } from "./complex";

/**
 * Identity Gate
 * [1 0]
 * [0 1]
 *
 * In the Bloch sphere representation, does nothing lol.
 */
export function I(qs: Qubits) {
  return qs;
}

/**
 * Pauli X Gate
 * [0 1]
 * [1 0]
 *
 * In the Bloch sphere representation, flips a qubit 180 degrees about the x axis.
 */
export function X(qs: Qubits, q1: number) {}

/**
 * Pauli Y Gate
 * [0 -i]
 * [i  0]
 *
 * In the Bloch sphere representation, flips a qubit 180 degrees about the y axis.
 */
export function Y(q: Qubit) {
  return {
    0: q[1].imult(-1),
    1: q[0].imult(1)
  };
}

/**
 * Pauli Z Gate
 * [1  0]
 * [0 -1]
 *
 * In the Bloch sphere representation, flips a qubit 180 degrees about the z axis.
 */
export function Z(q: Qubit) {
  return {
    0: q[0],
    1: q[1].neg()
  };
}

/**
 * Hadamard Gate
 * [1  1] * 1/sqrt(2)
 * [1 -1]
 *
 * In the Bloch sphere representation, flips a qubit 180 degrees about the z axis.
 */
export function H(q: Qubit) {
  const half = 1 / Math.sqrt(2);
  const halfZero = q[0].rmult(half);
  const halfOne = q[1].rmult(half);
  return {
    0: halfZero.add(halfOne),
    1: halfZero.add(halfOne.neg())
  };
}
