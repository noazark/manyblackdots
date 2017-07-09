import { PROP_STATIC, PROP_COLLIDABLE, PROP_KILLER } from './engine';

function noop () {
  // noop
}

// A throttling function with a few rules:
//
// - You must start burn while on the floor (dy == 0)
// - Burn starts when global state is up
// - Burn ends after timer, or when parent hits floor (dy == 0)
export function throttle(name, burn=1000, burnFunc=noop) {
  const _data = {};

  return function _func(data) {
    const now = Date.now();
    const burndownKey = `burndown`;
    const timerKey = `timer`;

    if (this.dy === 0) {
      clearTimeout(_data[timerKey]);
      delete _data[burndownKey];
    }

    if (_data[burndownKey] == null) {
      _data[burndownKey] = now + burn;
    }

    let burnRemaining = 0;

    if (now <= _data[burndownKey]) {
      burnRemaining = (_data[burndownKey] - now) / 1000;
    }

    return burnFunc.call(this, data, burnRemaining);
  };
}

export function cosThrottle(burn) {
  return throttle('accel', burn,
    function (data, burn) {
      const accel = {
        dy: this.dy - 0.08,
      };

      if (data.state.up && burn > 0) {
        accel.dy = this.dy + 0.04 + Math.cos(burn) * 0.05;
      }

      return accel;
    }
  );
}

export const SHAPE = {
  type: 'shape',
  properties: [PROP_STATIC],
  h: 0,
  w: 0,
  x: 0,
  y: 0,
};

export const BASE_OBSTACLE = Object.assign({}, SHAPE, {
  type: 'obstacle',
  color: '#333333',
  properties: [PROP_STATIC, PROP_COLLIDABLE, PROP_KILLER]
});

export const BASE_WALL = Object.assign({}, SHAPE, {
  type: 'wall',
  color: '#999999',
  properties: [PROP_STATIC, PROP_COLLIDABLE]
});

export const BASE_PLATFORM = Object.assign({}, SHAPE, {
  type: 'platform',
  color: '#333333',
  properties: [PROP_STATIC, PROP_COLLIDABLE],
  h: 1
});

export const BASE_HERO = Object.assign({}, SHAPE, {
  type: 'hero',
  color: '#333333',
  properties: [PROP_COLLIDABLE],
  h: 10,
  w: 10,
  x: 30,
  x0: 0,
  y0: 0,
  dx: 0.25,
  dy: 0,
  accel: throttle('accel', 500,
    function (data, burn) {
      if (data.state.up && burn > 0) {
        return {
          dy: burn * 1.001,
        };
      } else {
        return {
          dy: this.dy - 0.08,
        };
      }
    }
  )
});

export function clouds(count=10, xMin=0, xMax=100, yMin=0, yMax=100, config={}) {
  const clouds = [];

  for (let i=0; i < count; i++) {
    clouds.push(Object.assign({}, SHAPE, config, {
      x: Math.random() * (xMax - xMin) + xMin,
      y: Math.random() * (yMax - yMin) + yMin,
      w: Math.random() * 100,
      h: 1
    }));
  }

  return clouds;
}
