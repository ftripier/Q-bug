import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import math from 'mathjs';

import { StatelessGate as Gate } from './index';
import standardGates from '../../simulator/standardGates';

storiesOf('Gate', module)
  .add('Hadamard Gate', () => (
    <Gate
      openTooltip={action('open tooltip')}
      closeTooltip={action('close tooltip')}
      name="H"
      position={[0, 0]}
      size={[50, 50]}
      matrix={standardGates['H']}
      id="fake id"
    />
  ))
  .add('With truncated name', () => (
    <Gate
      name="HADAMARD_DIFFUSION_GATE"
      openTooltip={action('open tooltip')}
      closeTooltip={action('close tooltip')}
      position={[0, 0]}
      size={[50, 200]}
      matrix={math.matrix([
        [1.0, 0, 0, 0, 0, 0, 0, 0],
        [0, -1.0, 0, 0, 0, 0, 0, 0],
        [0, 0, -1.0, 0, 0, 0, 0, 0],
        [0, 0, 0, -1.0, 0, 0, 0, 0],
        [0, 0, 0, 0, -1.0, 0, 0, 0],
        [0, 0, 0, 0, 0, -1.0, 0, 0],
        [0, 0, 0, 0, 0, 0, -1.0, 0],
        [0, 0, 0, 0, 0, 0, 0, -1.0]
      ])}
      id="fake id"
    />
  ));
