import { parseQuilProgram } from '../../api/circuits';

export const SuperpostionSource = `H 0
CNOT 0 1`;

export default parseQuilProgram(SuperpostionSource);
