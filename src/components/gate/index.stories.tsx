import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import math from 'mathjs';

import { StatelessGate as Gate } from './index';
import standardGates from '../../simulator/standardGates';
import CNOTGate from './CNOTGate';
import { ControlBit } from './ControlBit';
import { XGate } from './XGate';

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
  ))
  .add('Control Bit', () => <ControlBit />)
  .add('X Gate', () => <XGate />)
  .add('CNOT Gate - top to bottom', () => <CNOTGate left={50} from={25} to={75} />)
  .add('CNOT Gate - bottom to top', () => <CNOTGate left={75} from={250} to={75} />);
