import { intersects } from "./collision";

export const PROP_STATIC = "static";
export const PROP_COLLIDABLE = "collideable";
export const PROP_KILLER = "killer";
export const PROP_WIN_ZONE = "win-zone";
export const PROP_DRAWABLE = "drawable";

const BASE_CONFIG = {
  name: "",
  description: "",
  showCollisions: false,
  showVectors: false,
  showGhosts: false,
};

export function loadLevels(levels) {
  for (let [k, v] of Object.entries(levels)) {
    levels[k] = initializeLevel(v);
  }
  return levels;
}

export function initializeLevel({ config, map }) {
  const level = {
    config: Object.freeze(Object.assign({}, BASE_CONFIG, config)),
    map,
  };

  level.config = Object.freeze(level.config);

  return level;
}

function getRectVertices(a) {
  return {
    a: { x: a.x, y: a.y },
    b: { x: a.x, y: a.y + a.h },
    c: { x: a.x + a.w, y: a.y + a.h },
    d: { x: a.x + a.w, y: a.y },
  };
}

function noop() {
  // noop
}

// A throttling function with a few rules:
//
// - You must start burn while on the floor (dy == 0)
// - Burn starts when global state is up
// - Burn ends after timer, or when parent hits floor (dy == 0)
function throttle(name, burn = 1000, burnFunc = noop) {
  const _data = {};

  return function _func(obj, data) {
    const now = Date.now();
    const burndownKey = `burndown`;
    const timerKey = `timer`;

    if (obj.dy === 0) {
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

    return burnFunc.call(this, obj, data, burnRemaining);
  };
}

const accel = throttle("accel", 500, function (obj, data, burn) {
  if (data.state.up && burn > 0) {
    return {
      dy: burn * 1.001,
    };
  } else {
    return {
      dy: obj.dy - 0.08,
    };
  }
});

function furthestExtent(data) {
  const extents = data.map.map((el) =>
    el.properties.includes(PROP_STATIC) ? el.x + el.w : 0
  );
  const furthestExtent = Math.max(...extents);
  return furthestExtent;
}

function atExtents(data) {
  const camera = data.map.find((el) => el.type === "camera");

  return camera.x + camera.w >= furthestExtent(data);
}

export function move(data, state) {
  data.state = { ...data.state, ...state };

  const hero = data.map.find((el) => el.type === "hero");
  Object.assign(hero, accel(hero, data));

  data.map = data.map.map((el) => {
    const obj = Object.assign({}, el);

    if (!obj.properties.includes(PROP_STATIC)) {
      obj.x0 = el.x;
      obj.y0 = el.y;

      obj.x += state.dt * el.dx;
      obj.y += state.dt * el.dy;
    }

    return obj;
  });

  if (atExtents(data)) {
    const camera = data.map.find((el) => el.type === "camera");
    camera.x = furthestExtent(data) - camera.w;
  }

  return data;
}

export function isJumping(data) {
  const hero = data.map.find((el) => el.type === "hero");
  return hero.dy !== 0;
}

function _detectCollision(a, b) {
  const aV = getRectVertices(a);
  const a0V = getRectVertices(Object.assign({}, a, { x: a.x0, y: a.y0 }));
  const bV = getRectVertices(b);

  const sides = [
    ["a", "b"],
    ["b", "c"],
    ["c", "d"],
    ["d", "a"],
  ];

  for (const ai in sides) {
    if (ai) {
      const aSide = sides[ai];
      for (const bi in sides) {
        if (bi) {
          const bSide = sides[bi];

          const intersection =
            intersects(
              aV[aSide[0]],
              a0V[aSide[0]],
              bV[bSide[0]],
              bV[bSide[1]]
            ) ||
            intersects(
              aV[aSide[0]],
              aV[aSide[1]],
              bV[bSide[0]],
              bV[bSide[1]]
            ) ||
            intersects(
              a0V[aSide[0]],
              a0V[aSide[1]],
              bV[bSide[0]],
              bV[bSide[1]]
            ) ||
            intersects(
              a0V[aSide[0]],
              a0V[aSide[1]],
              bV[bSide[0]],
              bV[bSide[1]]
            );

          if (intersection) {
            return [intersection, bSide.join("")];
          }
        }
      }
    }
  }

  return null;
}

export function detectCollision(data, map) {
  const collisions = [];
  const collidables = {
    heros: [],
    static: [],
  };
  map.reduce((m, o) => {
    if (
      !o.properties.includes(PROP_STATIC) &&
      o.properties.includes(PROP_COLLIDABLE)
    ) {
      m.heros.push(o);
    } else if (o.properties.includes(PROP_COLLIDABLE)) {
      m.static.push(o);
    }
    return m;
  }, collidables);

  if (data.state.showCollisions) {
    map.forEach((o) => {
      o.inCollision = false;
    });
  }

  collidables.heros.forEach((a) => {
    collidables.static.forEach((o) => {
      if (a === o) {
        return;
      }

      const collision = _detectCollision(a, o);
      if (collision) {
        const [intersection, side] = collision;

        if (data.state.showCollisions) {
          a.inCollision = true;
          o.inCollision = true;
        }

        collisions.push([a, o, intersection, side]);
      }
    });
  });

  return collisions;
}

function pathag(a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function sortCollisions(a, b) {
  const da = pathag(a[2].dx, a[2].dy);
  const db = pathag(b[2].dx, b[2].dy);

  if (da < db) {
    return -1;
  }

  if (da > db) {
    return 1;
  }

  return 0;
}

function filterCollisions(collision) {
  const collisionDistance = pathag(collision[2].dx, collision[2].dy);
  return collisionDistance > 0.1;
}

export function handleCollisions(data, collisions) {
  if ((collisions && collisions.length === 0) || data.state.isWinner === true) {
    return data;
  }

  const closestCollision = collisions.sort(sortCollisions)[0];
  const nearCollisions = collisions.filter(filterCollisions, {});

  // Allow hero to move once per axis, this is to handle pinch points between
  // two static objects and a collider. This is necessary to prevent the
  // movement of the same hero along a single axis. This could be avoided if
  // the data model was immutable.
  let hasMovedX = false;
  let hasMovedY = false;

  [closestCollision, ...nearCollisions].forEach((col) => {
    const [hero, collision, intersection, side] = col;

    if (collision.type === "platform" && hero.dy < 0) {
      hero.y += intersection.dy;
      hero.dy = 0;
    }

    if (collision.properties.includes(PROP_KILLER)) {
      data.state.isAlive = false;
    }

    if (collision.properties.includes(PROP_WIN_ZONE)) {
      data.state.isWinner = true;
    }

    if (collision.properties.includes(PROP_COLLIDABLE)) {
      if (side === "da" && hasMovedY === false) {
        hero.y += intersection.dy - hero.h;
        hasMovedY = true;
      } else if (side === "ab" && hasMovedX === false) {
        hero.x += intersection.dx - hero.w;
        hasMovedX = true;
      } else if (side === "bc" && hero.dy < 0 && hasMovedY === false) {
        hero.y += intersection.dy;
        hasMovedY = true;
      } else if (side === "cd" && hasMovedX === false) {
        hero.x += intersection.dx;
        hasMovedX = true;
      }
    }
  });

  return data;
}

export function createFrame(data) {
  // turn data into a single flat frame filled with objects to paint
  return data;
}
