import React from 'react';
import math from 'mathjs';
import { storiesOf } from '@storybook/react';

import Matrix from './index';

storiesOf('Matrix', module).add('Hadamard Diffusion Matrix', () => (
  <Matrix
    matrix={math.matrix([
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, -1, 0, 0, 0, 0, 0, 0],
      [0, 0, -1, 0, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0, 0],
      [0, 0, 0, 0, -1, 0, 0, 0],
      [0, 0, 0, 0, 0, -1, 0, 0],
      [0, 0, 0, 0, 0, 0, -1, 0],
      [0, 0, 0, 0, 0, 0, 0, -1]
    ])}
  />
));
