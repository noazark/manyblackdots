export const SHAPE = {
  type: 'shape',
  h: 0,
  w: 0,
  x: 0,
  y: 0,
};

export const BASE_OBSTACLE = {
  type: 'obstacle',
  color: '#333333',
  h: 10,
  w: 10,
  x: 0,
  y: 0,
};

export const BASE_PLATFORM = {
  type: 'platform',
  color: '#333333',
  h: 1,
  w: 100,
  x: 0,
  y: 80,
};

export const BASE_HERO = {
  type: 'hero',
  color: '#333333',
  h: 10,
  w: 10,
  x: 0,
  y: 0,
  dx: 0.35,
  dy: 0,
  maxForce: 15,
  force(d) {
    return d + 3;
  },
  accel(data) {
    if (data.state.up) {
      return {
        dy: this.dy + 1,
        dx: this.dx + 0.01
      };
    } else {
      return {
        dy: this.dy - 1.8,
        dx: 30/75
      };
    }
  },
  isJumping: false,
  hasClimaxed: false,
};

export function clouds(count=10, xMin=0, xMax=100, yMin=0, yMax=100, config={}) {
  const clouds = [];

  for (let i=0; i < count; i++) {
    clouds.push(Object.assign({}, SHAPE, config, {
      x: Math.random() * (xMax - xMin) + xMin,
      y: Math.random() * (yMax - yMin) + yMin,
      w: Math.random() * 100,
      h: 0.5
    }));
  }

  return clouds;
}
