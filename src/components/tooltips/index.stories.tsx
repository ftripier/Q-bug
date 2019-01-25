import React from 'react';
import { storiesOf } from '@storybook/react';

import { WireSegmentTooltip, GateTooltip } from './index';
import standardGates from '../../simulator/standardGates';

storiesOf('Tooltips', module)
  .add('Wire Segment Tooltip', () => <WireSegmentTooltip top={0} left={0} probabilityZero={0.67} />)
  .add('Gate Tooltip', () => (
    <GateTooltip top={50} left={60} name={'H'} matrix={standardGates['H']} />
  ));
