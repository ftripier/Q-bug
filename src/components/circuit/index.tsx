import './index.css';
import React from 'react';
import { connect } from 'react-redux';
import Gate from '../gate';
import WireSegment from '../wire-segment';
import { GateLayout, WireSegmentLayout } from '../../state/ui/types';
import { getCircuitLayout, getWindowSize } from '../../state/ui/selectors/layout';
import { AppState } from '../../state/types';

export function StatelessCircuit({
  gates,
  wireSegments
}: {
  gates: GateLayout[];
  wireSegments: WireSegmentLayout[];
}) {
  return (
    <div className="circuit-canvas">
      <div className="circuit-wire-layer">
        {wireSegments.map(({ width, top, left, probabilityZero }, i) => (
          <WireSegment
            key={i}
            position={[left, top]}
            width={width}
            probabilityZero={probabilityZero}
          />
        ))}
      </div>
      <div className="circuit-gate-layer">
        {gates.map(({ name, top, left, width, height }, i) => (
          <Gate key={i} name={name} position={[left, top]} size={[width, height]} />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => {
  const { wireSegments, gates } = getCircuitLayout(state);
  const windowSize = getWindowSize(state);
  return {
    wireSegments,
    gates,
    windowSize
  };
};

export default connect(mapStateToProps)(StatelessCircuit);
