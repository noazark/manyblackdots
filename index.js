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

    hero.x += frame.dt * hero.dx;

    hero.y += hero.dy;
  });
}

function isJumping(data) {
  const hero = data.map.find((el) => el.type === 'hero');
  return hero.dy != 0;
}

function _detectCollision(a, b) {
  if (a !== b &&
     a.x < b.x + b.w &&
     a.x + a.w - a.dx > b.x &&
     a.y < b.y + b.h &&
     a.h - a.dy + a.y > b.y) {
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
      hero.hasClimaxed = false;
    } else if (collision.type === 'obstacle') {
      data.state.isAlive = false;
    }
  });
}

function draw(canvas, ctx, data, lastFrame) {
  const frame = {};

  if (data.state.startTime && data.state.isPlaying) {
    frame.pos = Date.now() - data.state.startTime;
    if (lastFrame) {
      frame.dt = frame.pos - lastFrame.pos;
    } else {
      frame.dt = 0;
    }
  } else {
    frame.dt = 0;
  }

  if (data.state.isPlaying && data.state.isAlive) {
    window.requestAnimationFrame(() => draw(canvas, ctx, data, frame));
  }

  if (data.state.isPlaying && data.state.isAlive) {
    moveHero(data, frame, frame);

    const collisions = detectCollision(data, data.map);
    handleCollisions(data, collisions);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoxes(ctx, data, data.map);
  drawScore(ctx, data);

  if (!data.state.isAlive) {
    drawGameOver(ctx, data);
  }
}

function start(canvas, ctx, data) {
  if (data.state.isPlaying === false) {
    data.state.startTime = Date.now();
    data.state.isPlaying = true;
    draw(canvas, ctx, data);
  }
}

const BASE_CONFIG = {
  cameraX: (d) => {
    return d.map.find((el) => el.type === 'hero').x - 30;
  },
  showCollisions: false
};

import { level1 } from './maps/main';
import {
  ladder,
  fallTest,
  verticalPlatform,
  jump,
  impossiblePlatform,
  thinGap,
} from './maps/test';

const levels = {
  level1,
  ladder,
  fallTest,
  verticalPlatform,
  jump,
  impossiblePlatform,
  thinGap,
};

function initalizeGame() {
  const { config, map } = levels.thinGap();

  return {
    canvas: {
      h: 300,
      w: 300
    },
    state: {
      offset: 0,
      isAlive: true,
      isPlaying: false,
      up: false,
      down: false,
      left: false,
      right: false,
    },
    config: Object.assign({}, BASE_CONFIG, config),
    map,
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

function handlePress() {
  if (data.state.isPlaying && !isJumping(data)) {
    data.state.up = true;
  }

  if (!data.state.isAlive) {
    data = initalizeGame();
  }

  if (!data.state.isPlaying) {
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
