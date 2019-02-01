import React from 'react';
const STRAIGHT_SEGMENT_LENGTH = 10;
const DENSE_WAVE_LENGTH = 6;
const SPARSE_WAVE_LENGTH = 30;
const WIRE_HEIGHT = 50;

function* generateSawWave(
  startPos: number,
  height: number,
  density: number,
  endPos: number
): IterableIterator<number[]> {
  let pos = startPos;
  const waveLength = DENSE_WAVE_LENGTH * density + SPARSE_WAVE_LENGTH * (1 - density);
  while (pos + waveLength < endPos) {
    const nextPos = pos + waveLength;
    yield [nextPos, height];
    yield [nextPos, 0];
    pos = nextPos;
  }
}

const sawWavePoints = (width: number, height: number, density: number) => {
  const midH = height * 0.5;
  const midW = width * 0.5;

  if (width < 15) {
    return `0,${midH} ${midW},${height} ${width},${midH}`;
  }
  const initialConnectionPoints = [[0, midH], [STRAIGHT_SEGMENT_LENGTH, midH]];
  const finalConnectionPoints = [[width - STRAIGHT_SEGMENT_LENGTH, midH], [width, midH]];
  const sawPoints = Array.from(
    generateSawWave(initialConnectionPoints[1][0], height, density, finalConnectionPoints[0][0])
  );
  const points = initialConnectionPoints.concat(sawPoints).concat(finalConnectionPoints);
  return points.map(pointSet => pointSet.join(',')).join(' ');
};

const LiveWire = ({
  width,
  density = 0,
  opacity = 1,
  blur = 0
}: {
  width: number;
  density?: number;
  opacity?: number;
  blur?: number;
}) => {
  const blurID = `${performance.now()}blur`;
  return (
    <svg
      width={width}
      height="100%"
      viewBox={`0 0 ${width} ${WIRE_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      opacity={opacity}
    >
      <filter id={blurID}>
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur * 4} />
      </filter>
      <polyline
        points={sawWavePoints(width, WIRE_HEIGHT, density)}
        fill="none"
        stroke="#414a4c"
        stroke-width="2"
        filter={`url(#${blurID})`}
      />
    </svg>
  );
};

export default React.memo(LiveWire);
