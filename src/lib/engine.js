export const PROP_STATIC = 'static';
export const PROP_COLLIDABLE = 'collideable';
export const PROP_KILLER = 'killer';

function round(num) {
  return ~~ (0.5 + num)
}

function _drawRect(ctx, data, r) {
  const x = r.x;
  const y = data.canvas.h - r.y - r.h;
  const width = r.w;
  const height = r.h;

  ctx.fillStyle = r.color;

  if (data.config.showCollisions && r.inCollision) {
    ctx.fillStyle = 'red';
  }

  ctx.fillRect(round(x - data.config.cameraX(data)), round(y), round(width), round(height));
}

function drawVectors(ctx, data, boxes) {
  boxes.forEach((r) => {
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    const cx = r.x - data.config.cameraX(data) + r.w / 2;
    const cy = data.canvas.h - r.y - r.h + r.h / 2;

    const vx = r.dx * 50;
    const vy = r.dy * 50;
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
  });
}

function drawGhosts(ctx, data, boxes) {
  boxes.forEach((r) => {
    ctx.fillStyle = 'blue';
    ctx.fillRect(r.x0 - data.config.cameraX(data), data.canvas.h - r.y0 - r.h, r.w, r.h);
  });
}


function getRectVertices(a) {
  return {
    a: { x: a.x, y: a.y },
    b: { x: a.x, y: a.y + a.h },
    c: { x: a.x + a.w, y: a.y + a.h },
    d: { x: a.x + a.w, y: a.y }
  };
}

function drawBoxes(ctx, data, boxes) {
  boxes.forEach((r) => _drawRect(ctx, data, r));
}

function drawGameOver(ctx, data) {
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'center';
  ctx.font = "24px monospace";
  ctx.fillText('Game Over', data.canvas.w / 2, data.canvas.h / 2);
}

export function move(data, frame) {
  const objs = data.map.filter((el) => el.properties && !el.properties.includes(PROP_STATIC));

  objs.forEach((obj) => {
    if (obj.hasOwnProperty('accel')) {
      Object.assign(obj, obj.accel(data));
    }

    obj.x0 = obj.x;
    obj.y0 = obj.y;

    obj.x += frame.dt * obj.dx;
    obj.y += frame.dt * obj.dy;
  });
}

export function isJumping(data) {
  const hero = data.map.find((el) => !el.properties.includes(PROP_STATIC));
  return hero.dy != 0;
}

import { intersects } from './collision.js';

function _detectCollision(a, b) {
  const aV = getRectVertices(a);
  const a0V = getRectVertices(Object.assign({}, a, { x: a.x0, y: a.y0 }));
  const bV = getRectVertices(b);

  const sides = [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
    ['d', 'a'],
  ];

  for (const ai in sides) {
    if (ai) {
      const aSide = sides[ai];
      for (const bi in sides) {
        if (bi) {
          const bSide = sides[bi];

          const intersection = intersects(aV[aSide[0]], a0V[aSide[0]], bV[bSide[0]], bV[bSide[1]]) ||
                               intersects(aV[aSide[0]], aV[aSide[1]], bV[bSide[0]], bV[bSide[1]]) ||
                               intersects(a0V[aSide[0]], a0V[aSide[1]], bV[bSide[0]], bV[bSide[1]]) ||
                               intersects(a0V[aSide[0]], a0V[aSide[1]], bV[bSide[0]], bV[bSide[1]]);

          if (intersection) {
            return [intersection, bSide.join('')];
          }
        }
      }
    }
  }

  return null;
}

function detectCollision(data, map) {
  const collisions = [];
  const collidables = {
    heros: [],
    static: []
  };
  map.reduce((m, o) => {
    if (!o.properties.includes(PROP_STATIC) && o.properties.includes(PROP_COLLIDABLE)) {
      m.heros.push(o);
    } else if (o.properties.includes(PROP_COLLIDABLE)) {
      m.static.push(o);
    }
    return m;
  }, collidables);

  map.forEach(o => {
    o.inCollision = false;
  });

  collidables.heros.forEach((a) => {
    collidables.static.forEach((o) => {
      if (a == o) {
        return;
      }

      const collision = _detectCollision(a, o);
      if (collision) {
        const [intersection, side] = collision;
        a.inCollision = true;
        o.inCollision = true;

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

function handleCollisions(data, collisions) {
  if (collisions && collisions.length === 0) {
    return;
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

    if (collision.type === 'platform' && hero.dy < 0) {
      hero.y += intersection.dy;
      hero.dy = 0;
    }

    if (collision.properties.includes(PROP_KILLER)) {
      data.state.isAlive = false;
    }

    if (collision.properties.includes(PROP_COLLIDABLE)) {
      if (side === 'da' && hasMovedY === false) {
        hero.y += intersection.dy - hero.h;
        hasMovedY = true;
      } else if (side === 'ab' && hasMovedX === false) {
        hero.x += intersection.dx - hero.w;
        hasMovedX = true;
      } else if (side === 'bc' && hero.dy < 0 && hasMovedY === false) {
        hero.y += intersection.dy;
        hasMovedY = true;
      } else if (side === 'cd' && hasMovedX === false) {
        hero.x += intersection.dx;
        hasMovedX = true;
      }
    }
  });
}

export function draw(canvas, ctx, data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const collisions = detectCollision(data, data.map);
  handleCollisions(data, collisions);

  if (data.config.showGhosts) {
    drawGhosts(ctx, data, data.map);
  }

  drawBoxes(ctx, data, data.map);

  if (data.config.showVectors) {
    drawVectors(ctx, data, data.map);
  }

  if (!data.state.isAlive) {
    drawGameOver(ctx, data);
  }
}
