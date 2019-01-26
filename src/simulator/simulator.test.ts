import Simulator from './simulator';
import standardGates from './standardGates';
import superposition from '../testing/fixtures/superposition';
import { getGateColumns } from '../state/data/selectors/circuit';
import reducer, { initialState } from '../state/reducer';
import { setCircuitState } from '../state/actionCreators';
import inverseOrderCNOT from '../testing/fixtures/inverseOrderCNOT';
import { circuit } from '../state/data/types';

function applyAllGatesToSimulator(circuit: circuit, simulator: Simulator) {
  const state = reducer(initialState, setCircuitState(circuit));
  const gateColumns = getGateColumns(state);
  for (let i = 0; i < gateColumns.length; i += 1) {
    const { gates } = gateColumns[i];
    gates.forEach(gate => simulator.applyGate(gate));
  }
}

describe('Simulator', () => {
  it('has probability = 1 of measuring zero for all qubits initially', () => {
    let n = 3;
    const simulator = new Simulator(3);

    for (let i = 0; i < n; i += 1) {
      expect(simulator.getProbablityZeroForQubit(i)).toBeCloseTo(1);
    }
  });

  it('returns the correct probabilities after a hadamard gate has been applied to a qubit', () => {
    const simulator = new Simulator(2);
    simulator.applyGate({
      type: 'GATE',
      name: 'H',
      qubits: [0],
      matrix: standardGates['H'],
      sparse: false,
      wireMask: 1
    });
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(1 / 2);

    simulator.applyGate({
      type: 'GATE',
      name: 'H',
      qubits: [1],
      matrix: standardGates['H'],
      sparse: false,
      wireMask: 1
    });
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(1 / 2);
    expect(simulator.getProbablityZeroForQubit(1)).toBeCloseTo(1 / 2);
  });

  it('returns the correct probabilites for a bell state', () => {
    const simulator = new Simulator(2);
    applyAllGatesToSimulator(superposition, simulator);
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(1 / 2);
    expect(simulator.getProbablityZeroForQubit(1)).toBeCloseTo(1 / 2);
  });

  it('returns the correct probabilities for an inverse ordered CNOT', () => {
    const simulator = new Simulator(2);
    applyAllGatesToSimulator(inverseOrderCNOT, simulator);
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(0);
  });
});
