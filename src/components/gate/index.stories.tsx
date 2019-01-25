import React from 'react';
import { storiesOf } from '@storybook/react';

import Gate from './index';

storiesOf('Gate', module)
  .add('Hadamard Gate', () => <Gate name="H" position={[0, 0]} size={[50, 50]} />)
  .add('With truncated name', () => (
    <Gate name="HADAMARD_DIFFUSION_GATE" position={[0, 0]} size={[50, 200]} />
  ));
