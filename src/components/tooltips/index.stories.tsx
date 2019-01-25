import React from 'react';
import { storiesOf } from '@storybook/react';

import { WireSegmentTooltip } from './index';

storiesOf('Tooltips', module).add('Wire Segment Tooltip', () => (
  <WireSegmentTooltip top={0} left={0} probabilityZero={0.67} />
));
