function _drawRect(ctx, data, r) {
  const x = r.x;
  const y = data.canvas.h - r.y - r.h;
  const width = r.w;
  const height = r.h;

  ctx.fillRect(x, y, width, height);
}

function reposition(data, o) {
  return Object.assign({}, o, { x: o.x - data.config.offset });
}

function drawBoxes(ctx, data, boxes) {
  boxes.map((o) => reposition(data, o)).forEach((r) => _drawRect(ctx, data, r));
}

function drawHero(ctx, data) {
  _drawRect(ctx, data, data.hero);
}

function drawScore(ctx, data) {
  ctx.textAlign = 'left';
  ctx.font = "18px monospace";
  ctx.fillText(`${Math.floor(data.score)}`, 5, 23);
}

function drawGameOver(ctx, data) {
  ctx.textAlign = 'center';
  ctx.font = "24px monospace";
  ctx.fillText('Game Over', data.canvas.w / 2, data.canvas.h / 2);
}

function moveHero(data) {
  if (data.state.up && !data.hero.hasClimaxed) {
    data.hero.dy = data.config.jumpAccel(data.hero.dy);
  } else {
    data.hero.dy = data.config.jumpDecel(data.hero.dy);
  }

  if (data.hero.dy > data.config.jumpAccelMax) {
    data.hero.hasClimaxed = true;
  }

  data.hero.y += data.hero.dy;
}

function isJumping(data) {
  return data.hero.dy != 0;
}

function _detectCollision(a, b) {
  if (a.x < b.x + b.w &&
     a.x + a.w - a.dx > b.x &&
     a.y < b.y + b.h &&
     a.h - a.dy + a.y > b.y) {
    return true;
  } else {
    return false;
  }
}

function detectCollision(data, a, b) {
  return b.filter((o) => {
    return _detectCollision(a, reposition(data, o));
  });
}

function stop(data) {
  data.state.isPlaying = false;
}

function handleCollisions(data, collisions) {
  if (collisions.length === 0) {
    return;
  }

  collisions.forEach((collision) => {
    if (collision.type === 'platform') {
      data.hero.y = collision.y + collision.h;
      data.hero.dy = 0;
      data.hero.hasClimaxed = false;
    } else if (collision.type === 'obstacle') {
      data.state.isAlive = false;
      stop(data);
    }
  });
}

function draw(canvas, ctx, data) {
  if (data.state.isPlaying) {
    window.requestAnimationFrame(() => draw(canvas, ctx, data));
  }

  data.config.offset += data.config.gameSpeed;
  moveHero(data);

  // return first detected collision
  const collisions = detectCollision(data, data.hero, data.level);

  handleCollisions(data, collisions);

  if (data.state.isAlive) {
    data.score += 0.4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHero(ctx, data);
    drawBoxes(ctx, data, data.level);
    drawScore(ctx, data);
  } else {
    drawGameOver(ctx, data);
  }
}

function start(canvas, ctx, data) {
  if (data.state.isPlaying === false) {
    data.state.isPlaying = true;
    draw(canvas, ctx, data);
  }
}

const BASE_OBSTACLE = {
  type: 'obstacle',
  h: 10,
  w: 10,
  x: 0,
  y: 0,
};

const BASE_PLATFORM = {
  type: 'platform',
  h: 1,
  w: 100,
  x: 0,
  y: 80,
};

const level1 = [
  Object.assign({}, BASE_OBSTACLE, { w: 99999, y: -100 }),
  Object.assign({}, BASE_PLATFORM, { y: 0, w: 99999 }),
  Object.assign({}, BASE_PLATFORM, { w: 100, x: 450, y: 40 }),
  Object.assign({}, BASE_PLATFORM, { w: 100, x: 650, y: 40 }),
  Object.assign({}, BASE_PLATFORM, { w: 200, x: 1250 }),
  Object.assign({}, BASE_OBSTACLE, { w: 30, h: 30, x: 1350 }),
  Object.assign({}, BASE_PLATFORM, { w: 200, x: 1550 }),
  Object.assign({}, BASE_PLATFORM, { w: 300, x: 1850, y: 40 }),
  Object.assign({}, BASE_OBSTACLE, { w: 20, h: 60, x: 2000 }),
];

function initalizeGame() {
  const level = level1;

  return {
    score: 0,
    config: {
      offset: 0,
      jumpAccelMax: 12,
      jumpAccel: (d) => d + 1.2,
      jumpDecel: (d) => d - 1.8,
      gameSpeed: 5,
      deltaGameSpeed: 1.0005,
    },
    canvas: {
      h: 300,
      w: 300
    },
    state: {
      isAlive: true,
      isPlaying: false,
      up: false,
      down: false,
      left: false,
      right: false,
    },
    hero: {
      h: 10,
      w: 10,
      x: 30,
      y: 1,
      dx: 0,
      dy: 0,
      isJumping: false,
      hasClimaxed: false,
    },
    level,
  };
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let data = initalizeGame();

// retina bloating
canvas.width = data.canvas.w * 2;
canvas.height = data.canvas.h * 2;
canvas.style.width = `${data.canvas.w}px`;
canvas.style.height = `${data.canvas.h}px`;
ctx.scale(2, 2);
ctx.fillStyle = '#333333';

function handlePress() {
  if (data.state.isPlaying && !isJumping(data)) {
    data.state.up = true;
  }

  if (!data.state.isPlaying || !data.state.isAlive) {
    data = initalizeGame();
    start(canvas, ctx, data);
  }
}

function handleRelease() {
  data.state.up = false;
}

document.addEventListener('touchstart', handlePress);
document.addEventListener('keydown', handlePress);
document.addEventListener('touchend', handleRelease);
document.addEventListener('keyup', handleRelease);

draw(canvas, ctx, data);
