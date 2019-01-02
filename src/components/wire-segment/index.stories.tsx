import React from 'react';
import { storiesOf } from '@storybook/react';

import WireSegment from './index';

console.log(WireSegment);

storiesOf('WireSegment', module).add('Regular Wire Segment', () => (
  <WireSegment position={[0, 50]} width={50} />
));
