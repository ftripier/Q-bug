import React from 'react';
import { storiesOf } from '@storybook/react';

import WireSegment from './index';

storiesOf('WireSegment', module)
  .add('Regular Wire Segment', () => (
    <WireSegment position={[0, 50]} width={50} probabilityZero={1} />
  ))
  .add('Blurry wire segment', () => (
    <WireSegment position={[0, 50]} width={50} probabilityZero={0.5} />
  ));
