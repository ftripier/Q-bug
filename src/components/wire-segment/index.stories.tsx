import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { StatelessWireSegment as WireSegment } from './index';
import LiveWire from '../wire-segment/LiveWire';

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
  .add('LiveWire - dense', () => <LiveWire density={1} width={100} />);
