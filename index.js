function _drawRect(r) {
  const x = r.x;
  const y = data.canvas.h - r.y - r.h;
  const width = r.w;
  const height = r.h;

  ctx.fillRect(x, y, width, height);
}

function drawBoxes(boxes) {
  boxes.map((o) => reposition(data, o)).forEach(_drawRect);
}

function drawHero() {
  _drawRect(data.hero);
}

function drawScore() {
  ctx.textAlign = 'left';
  ctx.font = "18px monospace";
  ctx.fillText(`${Math.floor(data.score)}`, 5, 23);
}

function drawGameOver() {
  ctx.textAlign = 'center';
  ctx.font = "24px monospace";
  ctx.fillText('Game Over', data.canvas.w / 2, data.canvas.h / 2);
}

function moveHero() {
  if (data.state.up && !data.hero.hasClimaxed) {
    data.hero.isJumping = true;
    data.hero.dy = data.config.jumpAccel(data.hero.dy);
  } else {
    data.hero.dy = data.config.jumpDecel(data.hero.dy);
  }

  if (data.hero.dy > data.config.jumpAccelMax) {
    data.hero.hasClimaxed = true;
  }

  data.hero.y += data.hero.dy;
}

function reposition(data, o) {
  return Object.assign({}, o, { x: o.x - data.config.offset });
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
  return b.find((o) => {
    return _detectCollision(a, reposition(data, o));
  });
}

function handleCollision(data, collision) {
  if (collision == null) {
    return;
  }

  if (collision.type === 'platform') {
    data.hero.y = collision.y + collision.h;
    data.hero.dy = 0;
    data.hero.hasClimaxed = false;
    data.hero.isJumping = false;
  } else if (collision.type === 'obstacle') {
    data.state.isAlive = false;
    stop();
  }
}

function draw() {
  if (data.state.isPlaying) {
    window.requestAnimationFrame(() => draw());
  }

  data.config.gameSpeed *= data.config.deltaGameSpeed;
  data.config.offset += data.config.gameSpeed;
  moveHero();

  // return first detected collision
  const collision = [
    detectCollision(data, data.hero, data.obstacles),
    detectCollision(data, data.hero, data.stepables)
  ].find(val => val);

  handleCollision(data, collision);

  if (data.state.isAlive) {
    data.score += 0.4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHero();
    drawBoxes(data.obstacles);
    drawBoxes(data.stepables);
    drawScore();
  } else {
    drawGameOver();
  }
}

function start() {
  if (data.state.isPlaying === false) {
    data.state.isPlaying = true;
    draw();
  }
}

function stop() {
  data.state.isPlaying = false;
}

function initalizeGame() {
  const obstacles = [];
  const stepables = [{
    type: 'platform',
    x: 0,
    y: 0,
    h: 1,
    w: 99999
  }];

  for (let i=1; i <= 99; i++) {
    const type = Math.floor(Math.random() * obstacleTypes.length);
    const obstacle = Object.assign({}, obstacleTypes[type], {
      x: 300 * 1.5 * i,
      y: 1,
    });
    obstacles.push(obstacle);
  }

  for (let i=1; i <= 99; i++) {
    const type = Math.floor(Math.random() * stepableTypes.length);
    const stepable = Object.assign({}, stepableTypes[type], {
      x: 300 * 1.2 * i,
      y: 20 + Math.random() * 40,
    });
    stepables.push(stepable);
  }

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
    obstacles,
    stepables
  };
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const obstacleTypes = [{
  type: 'obstacle',
  x: 0,
  y: 0,
  w: 20,
  h: 70,
}, {
  type: 'obstacle',
  x: 0,
  y: 0,
  w: 40,
  h: 40,
}, {
  type: 'obstacle',
  x: 0,
  y: 0,
  w: 60,
  h: 20,
}];

const stepableTypes = [{
  type: 'platform',
  x: 0,
  y: 0,
  w: 60,
  h: 1,
}, {
  type: 'platform',
  x: 0,
  y: 0,
  w: 80,
  h: 1,
}, {
  type: 'platform',
  x: 0,
  y: 0,
  w: 100,
  h: 1,
}];

let data = initalizeGame();

// retina bloating
canvas.width = data.canvas.w * 2;
canvas.height = data.canvas.h * 2;
canvas.style.width = `${data.canvas.w}px`;
canvas.style.height = `${data.canvas.h}px`;
ctx.scale(2, 2);
ctx.fillStyle = '#333333';

function handlePress(e) {
  if (!data.hero.isJumping) {
    data.state.up = true;
  }

  if (!data.state.isPlaying || !data.state.isAlive) {
    data = initalizeGame();
    start();
  }
}

function handleRelease(e) {
  data.state.up = false;
}

document.addEventListener('touchstart', handlePress);
document.addEventListener('keydown', handlePress);
document.addEventListener('touchend', handleRelease);
document.addEventListener('keyup', handleRelease);

draw();
