import './index.css';
import { connect } from 'react-redux';
import React from 'react';
import { Dispatch } from 'redux';
import { openWireSegmentTooltip, closeWireSegmentTooltip } from '../../state/actionCreators';
import { WireSegmentID } from '../../state/data/types';
import { AppState } from '../../state/types';
import { getWireSegmentTooltips } from '../../state/ui/selectors/tooltips';
import { WireSegmentTooltip } from '../tooltips';

function injectBlurStyles(probabilityZero: number) {
  const blurPx = (1 - probabilityZero) * 2;
  const blurString = `blur(${blurPx}px)`;
  return {
    WebkitFilter: blurString,
    MozFilter: blurString,
    filter: blurString,
    msFilter: blurString
  };
}

interface WireSegmentProps {
  position: number[];
  width: number;
  probabilityZero: number;
  id: WireSegmentID;
  tooltipIsOpen?: boolean;
  closeTooltip: () => void;
  openTooltip: () => void;
}

export const StatelessWireSegment = React.memo(
  ({
    position,
    width,
    probabilityZero,
    tooltipIsOpen = false,
    openTooltip,
    closeTooltip
  }: WireSegmentProps) => (
    <React.Fragment>
      <div
        className="circuit-wire-segment"
        style={{
          transform: `translate(${position[0]}px, ${position[1] - 30}px)`,
          width: `${width}px`
        }}
        onMouseEnter={openTooltip}
        onMouseLeave={closeTooltip}
      >
        <div
          className="circuit-wire-segment-line"
          style={{ ...injectBlurStyles(probabilityZero) }}
        />
      </div>
      {tooltipIsOpen && (
        <WireSegmentTooltip
          top={position[1]}
          left={position[0]}
          probabilityZero={probabilityZero}
        />
      )}
    </React.Fragment>
  )
);

const mapDispatchToProps = (dispatch: Dispatch, ownProps: WireSegmentProps) => ({
  openTooltip() {
    dispatch(openWireSegmentTooltip(ownProps.id));
  },
  closeTooltip() {
    dispatch(closeWireSegmentTooltip(ownProps.id));
  }
});

const mapStateToProps = (state: AppState, ownProps: WireSegmentProps) => {
  const tooltips = getWireSegmentTooltips(state);
  const tooltipIsOpen = Boolean(tooltips[ownProps.id]);
  return {
    tooltipIsOpen
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatelessWireSegment);
