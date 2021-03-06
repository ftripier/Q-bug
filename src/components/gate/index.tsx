import './index.css';
import { connect } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import { CSSTransitionGroup } from 'react-transition-group';
import { openGateTooltip, closeGateTooltip } from '../../state/actionCreators';
import { GateID } from '../../state/data/types';
import { getGateTooltips } from '../../state/ui/selectors/tooltips';
import { AppState } from '../../state/types';
import { GateTooltip } from '../tooltips';
import { Matrix } from 'mathjs';
import CNOTGate from './CNOTGate';

interface GateProps {
  name: string;
  position: number[];
  size: number[];
  id: GateID;
  tooltipIsOpen?: boolean;
  openTooltip: () => void;
  closeTooltip: () => void;
  matrix: Matrix;
}

const SwitchGate = ({
  name,
  position,
  size,
  openTooltip,
  closeTooltip
}: {
  name: string;
  position: number[];
  size: number[];
  openTooltip: () => void;
  closeTooltip: () => void;
}) => {
  const sidewaysNameDisplay = name.length >= 7 && size[1] >= 60;
  switch (name) {
    case 'CNOT':
      return (
        <div onMouseEnter={openTooltip} onMouseLeave={closeTooltip}>
          <CNOTGate left={position[0]} from={position[1]} to={position[1] + size[1]} />
        </div>
      );
    default:
      return (
        <div
          className="circuit-gate"
          style={{
            transform: `translate(${position[0]}px, ${position[1]}px)`,
            width: `${size[0]}px`,
            height: `${size[1]}px`
          }}
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
        >
          <div className={`${sidewaysNameDisplay ? 'sideways-text' : ''} circuit-gate-label`}>
            {name}
          </div>
        </div>
      );
  }
};

export const StatelessGate = React.memo(function Gate({
  name,
  position,
  size,
  matrix,
  tooltipIsOpen = false,
  openTooltip,
  closeTooltip
}: GateProps) {
  return (
    <React.Fragment>
      <SwitchGate {...{ name, position, size, openTooltip, closeTooltip }} />
      <CSSTransitionGroup
        transitionName="tooltip"
        transitionEnterTimeout={150}
        transitionLeaveTimeout={50}
      >
        {tooltipIsOpen && (
          <GateTooltip
            key="gate-tooltip"
            top={position[1] + size[1]}
            left={position[0]}
            name={name}
            matrix={matrix}
          />
        )}
      </CSSTransitionGroup>
    </React.Fragment>
  );
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: GateProps) => ({
  openTooltip() {
    dispatch(openGateTooltip(ownProps.id));
  },
  closeTooltip() {
    dispatch(closeGateTooltip(ownProps.id));
  }
});

const mapStateToProps = (state: AppState, ownProps: GateProps) => {
  const tooltips = getGateTooltips(state);
  const tooltipIsOpen = Boolean(tooltips[ownProps.id]);
  return {
    tooltipIsOpen
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatelessGate);
