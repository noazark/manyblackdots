import { isJumping, draw, moveHero } from './lib/engine';
import { Loop } from './lib/loop';

const BASE_CONFIG = {
  cameraX: (d) => {
    return d.map.find((el) => el.type === 'hero').x - 30;
  },
  showCollisions: false,
  showVectors: false,
  showGhosts: false,
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
      up: false,
      down: false,
      left: false,
      right: false,
    },
    config: Object.assign({}, BASE_CONFIG, config),
    map,
  };
}

let data = initalizeGame();
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const engine = new Loop((dt) => {
  moveHero(data, { dt });
  draw(canvas, ctx, data);

  if (!data.state.isAlive) {
    engine.stop();
  }
});


// retina bloating
canvas.width = data.canvas.w * 2;
canvas.height = data.canvas.h * 2;
canvas.style.width = `${data.canvas.w}px`;
canvas.style.height = `${data.canvas.h}px`;
ctx.scale(2, 2);

function handlePress() {
  if (!isJumping(data)) {
    data.state.up = true;
  }

  if (!data.state.isAlive) {
    data = initalizeGame();
  }

  if (!engine.running) {
    engine.start();
  }
}

function handleRelease() {
  data.state.up = false;
}

document.addEventListener('touchstart', handlePress);
document.addEventListener('keydown', handlePress);
document.addEventListener('touchend', handleRelease);
document.addEventListener('keyup', handleRelease);

engine.tick();
