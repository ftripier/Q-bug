import { parseQuilProgram } from '../../api/circuits';

export const InverseOrderCNOTSource = `X 1
CNOT 1 0`;

export default parseQuilProgram(InverseOrderCNOTSource);
