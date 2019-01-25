import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { StatelessWireSegment as WireSegment } from './index';

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
  ));
