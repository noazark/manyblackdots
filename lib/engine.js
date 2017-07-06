function _drawRect(ctx, data, r) {
  const x = r.x;
  const y = data.canvas.h - r.y - r.h;
  const width = r.w;
  const height = r.h;

  ctx.fillStyle = r.color;

  if (data.config.showCollisions && r.inCollision) {
    ctx.fillStyle = 'red';
  }

  ctx.fillRect(x - data.config.cameraX(data), y, width, height);
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

function drawHitbox(ctx, data, collisions) {
  collisions.forEach(([a, b]) => {
    const aV = getRectVertices(a);
    const a0V = getRectVertices(Object.assign({}, a, { x: a.x0, y: a.y0 }));
    const bV = getRectVertices(b);

    ctx.strokeStyle = 'red';

    ctx.beginPath();
    ctx.moveTo(bV.a.x - data.config.cameraX(data), data.canvas.h - bV.a.y);
    ctx.lineTo(bV.b.x - data.config.cameraX(data), data.canvas.h - bV.b.y);
    ctx.lineTo(bV.c.x - data.config.cameraX(data), data.canvas.h - bV.c.y);
    ctx.lineTo(bV.d.x - data.config.cameraX(data), data.canvas.h - bV.d.y);
    ctx.closePath();

    Object.keys(aV).forEach((v) => {
      ctx.moveTo(aV[v].x - data.config.cameraX(data), data.canvas.h - aV[v].y);
      ctx.lineTo(a0V[v].x - data.config.cameraX(data), data.canvas.h - a0V[v].y);
    });
    ctx.stroke();
  });
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

function moveHero(data, frame) {
  const heros = data.map.filter((el) => el.type === 'hero');

  heros.forEach((hero) => {
    Object.assign(hero, hero.accel(data));

    hero.x0 = hero.x;
    hero.y0 = hero.y;

    hero.x += frame.dt * hero.dx;
    hero.y += frame.dt * hero.dy;
  });
}

export function isJumping(data) {
  const hero = data.map.find((el) => el.type === 'hero');
  return hero.dy != 0;
}

import { intersects } from './collision.js';

function _detectCollision(a, b) {
  const aV = getRectVertices(a);
  const a0V = getRectVertices(Object.assign({}, a, { x: a.x0, y: a.y0 }));
  const bV = getRectVertices(b);

  return Object.keys(aV).some((v) => {
    return intersects(aV[v], a0V[v], bV.a, bV.b) ||
    intersects(aV[v], a0V[v], bV.b, bV.c) ||
    intersects(aV[v], a0V[v], bV.c, bV.d) ||
    intersects(aV[v], a0V[v], bV.d, bV.a);
  });
}

function detectCollision(data, map) {
  const collisions = [];
  const heros = map.filter((o) => o.type === 'hero');

  map.forEach(o => {
    o.inCollision = false;
  });

  heros.forEach((a) => {
    map.forEach((o) => {
      if (_detectCollision(a, o)) {
        a.inCollision = true;
        o.inCollision = true;

        collisions.push([a, o]);
      }
    });
  });

  return collisions;
}

function stop(data) {
  data.state.isPlaying = false;
}

function handleCollisions(data, collisions) {
  collisions.forEach(([hero, collision]) => {
    if (collision.type === 'platform') {
      hero.y = collision.y + collision.h + 1;
      hero.dy = 0;
    } else if (collision.type === 'obstacle') {
      data.state.isAlive = false;
    } else if (collision.type === 'wall') {
      // find point of intersection and move to it
      hero.y = collision.y - hero.h - 1;
    }
  });
}

export function draw(canvas, ctx, data, frame) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (data.state.isAlive) {
    moveHero(data, frame);
  }

  const collisions = detectCollision(data, data.map);
  handleCollisions(data, collisions);

  if (data.config.showGhosts) {
    drawGhosts(ctx, data, data.map);
  }

  drawBoxes(ctx, data, data.map);

  if (data.config.drawHitbox) {
    drawHitbox(ctx, data, collisions);
  }

  if (data.config.showVectors) {
    drawVectors(ctx, data, data.map);
  }

  if (!data.state.isAlive) {
    drawGameOver(ctx, data);
  }
}

export function start(canvas, ctx, data) {
  if (data.state.isPlaying === false) {
    data.state.startTime = Date.now();
    data.state.isPlaying = true;
  }
}
