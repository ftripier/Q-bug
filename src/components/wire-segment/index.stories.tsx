import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { StatelessWireSegment as WireSegment } from './index';
import LiveWire from '../wire-segment/LiveWire';

class WireSlider extends React.PureComponent {
  state: {
    probabilityZero: number;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      probabilityZero: 1
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ probabilityZero: e.target.value });
  }

  render() {
    return (
      <div>
        <label>
          <span
            style={{
              display: 'inline-block',
              width: '36px'
            }}
          >
            {this.state.probabilityZero}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={this.state.probabilityZero}
            onChange={this.handleChange}
          />
        </label>

        <WireSegment
          openTooltip={action('open tooltip')}
          closeTooltip={action('close tooltip')}
          position={[0, 50]}
          width={150}
          probabilityZero={this.state.probabilityZero}
          id="rofl"
        />
      </div>
    );
  }
}

storiesOf('WireSegment', module)
  .add('Regular Wire Segment', () => (
    <WireSegment
      openTooltip={action('open tooltip')}
      closeTooltip={action('close tooltip')}
      position={[0, 50]}
      width={50}
      probabilityZero={1}
      id="lol"
    />
  ))
  .add('Blurry wire segment', () => (
    <WireSegment
      openTooltip={action('open tooltip')}
      closeTooltip={action('close tooltip')}
      position={[0, 50]}
      width={50}
      probabilityZero={0.5}
      id="rofl"
    />
  ))
  .add('Live wire segment', () => (
    <WireSegment
      openTooltip={action('open tooltip')}
      closeTooltip={action('close tooltip')}
      position={[0, 50]}
      width={50}
      probabilityZero={0}
      id="rofl"
    />
  ))
  .add('LiveWire - sparse', () => <LiveWire density={0} width={100} />)
  .add('LiveWire - dense', () => <LiveWire density={1} width={100} />)
  .add('WireSegment w/ probability slider', () => <WireSlider />);
