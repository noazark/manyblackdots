import { isJumping, start, draw } from './lib/engine';
import { Loop } from './lib/loop';

const BASE_CONFIG = {
  cameraX: (d) => {
    return d.map.find((el) => el.type === 'hero').x - 30;
  },
  showCollisions: true,
  showVectors: true,
  showGhosts: true,
  drawHitbox: true,
};

import * as mainLevels from './maps/main';
import * as testLevels from './maps/tests';

const levels = {};
Object.assign(levels, mainLevels, testLevels);

function initalizeGame() {
  const level = window.location.hash.slice(1) || 'level1';
  const { config, map } = levels[level]();

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

const engine = new Loop((dt) => {
  if (data.state.isPlaying) {
    draw(canvas, ctx, data, { dt });
  }
});
engine.start();

draw(canvas, ctx, data, { dt: 0 });
