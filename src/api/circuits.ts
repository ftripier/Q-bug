import math from 'mathjs';
import quilToJSON from 'quil-json-js';
import { Expression, circuit } from '../state/data/types';
import { CIRCUIT_INSTRUCTION_TYPES } from '../state/data/reducers/circuit';

function sortQubits(circuit: circuit) {
  const gates = circuit.filter(({ type }) => type === CIRCUIT_INSTRUCTION_TYPES.GATE);
  gates.forEach(gate => gate.qubits.sort());
}

function parseGateDefExpressions(circuit: circuit) {
  const gateDefs = circuit.filter(instr => instr.type == CIRCUIT_INSTRUCTION_TYPES.DEFGATE);
  gateDefs.forEach(gateDef => {
    const { matrix } = gateDef;
    const parsedExpressions = matrix.map((row: Expression[]) =>
      row.map(component => math.eval(component.expression))
    );
    gateDef.matrix = math.matrix(parsedExpressions);
  });
}

export const parseQuilProgram = (quilSource: string): circuit => {
  const JSONcircuit = quilToJSON(quilSource);
  sortQubits(JSONcircuit);
  parseGateDefExpressions(JSONcircuit);
  return JSONcircuit;
};
