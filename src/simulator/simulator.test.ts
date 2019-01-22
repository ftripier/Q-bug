import Simulator from './simulator';

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
      qubits: [0]
    });
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(1 / 2);

    simulator.applyGate({
      type: 'GATE',
      name: 'H',
      qubits: [1]
    });
    expect(simulator.getProbablityZeroForQubit(0)).toBeCloseTo(1 / 2);
    expect(simulator.getProbablityZeroForQubit(1)).toBeCloseTo(1 / 2);
  });
});
