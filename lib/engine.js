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

function getHitbox(a, b) {
  return {
    ax0: a.x,
    ax1: a.x0,
    ay0: a.y,
    ay1: a.y0,
    bx0: b.x + b.w,
    bx1: b.x,
    by0: b.y + b.h,
    by1: b.y,
  };
}

function drawHitbox(ctx, data, collisions) {
  collisions.forEach(([a, b]) => {
    const {
      ax0, bx0,
      ax1, bx1,
      ay0, by0,
      ay1, by1,
    } = getHitbox(a, b);

    ctx.fillStyle = 'green';
    ctx.fillRect(ax0 - data.config.cameraX(data), data.canvas.h - ay0, ax1 - ax0, ay1 - ay0);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bx0 - data.config.cameraX(data), data.canvas.h - by0, bx1 - bx0, by1 - by0);
  });
}

function drawBoxes(ctx, data, boxes) {
  boxes.forEach((r) => _drawRect(ctx, data, r));
}

function drawScore(ctx, data) {
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.font = "18px monospace";
  ctx.fillText(`${Math.floor((Date.now() - data.state.startTime)/1000) || 0}`, 5, 23);
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

function _detectCollision(a, b) {
  const {
    ax0, bx0,
    ax1, bx1,
    ay0, by0,
    ay1, by1,
  } = getHitbox(a, b);

  if (a !== b &&
     ax0 < bx0 &&
     ax1 > bx1 &&
     ay0 < by0 &&
     ay1 > by1) {
    return true;
  } else {
    return false;
  }
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
      hero.y = collision.y + collision.h;
      hero.dy = 0;
    } else if (collision.type === 'obstacle') {
      data.state.isAlive = false;
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
  drawScore(ctx, data);

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
