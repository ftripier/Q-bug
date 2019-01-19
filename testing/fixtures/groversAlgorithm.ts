import quilToJSON from 'quil-json-js';

const GroversQuilSource = `DEFGATE GROVER_ORACLE:
    1.0, 0, 0, 0, 0, 0, 0, 0
    0, 1.0, 0, 0, 0, 0, 0, 0
    0, 0, -1.0, 0, 0, 0, 0, 0
    0, 0, 0, 1.0, 0, 0, 0, 0
    0, 0, 0, 0, 1.0, 0, 0, 0
    0, 0, 0, 0, 0, 1.0, 0, 0
    0, 0, 0, 0, 0, 0, 1.0, 0
    0, 0, 0, 0, 0, 0, 0, 1.0

DEFGATE HADAMARD_DIFFUSION:
    1.0, 0, 0, 0, 0, 0, 0, 0
    0, -1.0, 0, 0, 0, 0, 0, 0
    0, 0, -1.0, 0, 0, 0, 0, 0
    0, 0, 0, -1.0, 0, 0, 0, 0
    0, 0, 0, 0, -1.0, 0, 0, 0
    0, 0, 0, 0, 0, -1.0, 0, 0
    0, 0, 0, 0, 0, 0, -1.0, 0
    0, 0, 0, 0, 0, 0, 0, -1.0

H 0
H 1
H 2
GROVER_ORACLE 0 1 2
H 2
H 1
H 0
HADAMARD_DIFFUSION 0 1 2
H 0
H 1
H 2
GROVER_ORACLE 0 1 2
H 2
H 1
H 0
HADAMARD_DIFFUSION 0 1 2
H 0
H 1
H 2`;

export default quilToJSON(GroversQuilSource);
