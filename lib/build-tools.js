function noop () {
  // noop
}

// A throttling function with a few rules:
//
// - You must start burn while on the floor (dy == 0)
// - Burn starts when global state is up
// - Burn ends after timer, or when parent hits floor (dy == 0)
function throttle(name, burn=1000, refill=5000, burnFunc=noop, coolFunc=noop) {
  const _data = {};

  return function _func(data) {
    const now = Date.now();
    const burndownKey = `burndown`;
    const refillKey = `refill`;
    const timerKey = `timer`;

    if (this.dy === 0) {
      clearTimeout(_data[timerKey]);
      delete _data[burndownKey];
      delete _data[refillKey];
    }

    if (_data[refillKey] == null) {
      _data[burndownKey] = now + burn;
      _data[refillKey] = now + refill;

      _data[timerKey] = setTimeout(() => {
        delete _data[burndownKey];
        delete _data[refillKey];
      }, refill);
    }

    if (Date.now() <= _data[burndownKey] && data.state.up) {
      return burnFunc.call(this, data);
    } else {
      return coolFunc.call(this, data);
    }
  };
}

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
  x0: 0,
  y0: 0,
  x: 0,
  y: 0,
  dx: 0.35,
  dy: 0,
  maxForce: 1,
  force(d) {
    return d + 0;
  },
  accel: throttle('accel', 250, 3000,
    function () {
      return {
        dy: this.dy + 0.05,
      };
    },
    function () {
      return {
        dy: this.dy - 0.08,
      };
    }
  )
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
