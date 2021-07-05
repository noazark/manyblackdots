import {
  move,
  detectCollision,
  handleCollisions,
  createFrame,
} from "@/lib/engine";

let data = {};

function requestFrame(state) {
  data = move(data, state);
  const collisions = detectCollision(data, data.map);
  data = handleCollisions(data, collisions);
  const nextFrame = createFrame(data);

  return nextFrame;
}

function loadGame({ canvas, config, map }) {
  data = {
    canvas: { ...canvas },
    config: { ...config },
    map: [...map],
    state: {
      up: false,
      isAlive: true,
      isWinner: false,
    },
  };

  return data;
}

addEventListener("message", (e) => {
  let { event, args } = e.data;

  if (args == null) {
    args = {};
  }

  const handlers = {
    requestFrame,
    loadGame,
  };

  const response = handlers[event](...args);
  postMessage({ event, response });
});
