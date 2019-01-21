import Simulator from './simulator';
import groversAlgorithm from '../testing/fixtures/groversAlgorithm';
import { reduceNumberOfQubits } from '../state/data/selectors/circuit';

describe('Simulator', () => {
  it('has probability = 1 of measuring zero for all qubits initially', () => {
    const n = reduceNumberOfQubits(groversAlgorithm);
    const simulator = new Simulator(n);

    for (let i = 0; i < n; i += 1) {
      expect(simulator.getProbablityZeroForQubit(i)).toBeCloseTo(1);
    }
  });
});
