import { BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM } from '../index';

export function ladder() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_OBSTACLE, { w: 99999, y: -100 }),

      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 200, y: 6, w: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 400, y: 11, w: 300 }),
    ]
  };
}

// Demonstrates issus with collision detection on moving objects
export function fallTest() {
  let mapItems = [];

  for (let i = 0; i < 20; i++) {
    mapItems = mapItems.concat([
      Object.assign({}, BASE_HERO, { x: 15 * i, y: 250 + 20 * i }),
      Object.assign({}, BASE_PLATFORM, { x: 15 * i, y: 120 - Number(i), w: 10 }),
      Object.assign({}, BASE_OBSTACLE, { x: 15 * i, y: 50, w: 10, h: 50 }),
    ]);
  }

  return {
    config: {
      scrollrate: 0,
      jumpAccelMax: 2,
      jumpDecel: (d) => d - 0.15,
    },
    map: [
      ...mapItems
    ]
  };
}

// Platforms do not handle horizontal collisions very well
export function verticalPlatform() {
  return {
    config: {
      jumpAccelMax: 0,
      jumpDecel: () => 0,
    },
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1, dx: 2 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 200, y: 0, w: 1, h: 50 }),
      Object.assign({}, BASE_OBSTACLE, { x: 250, y: 0, w: 10, h: 50 }),
    ]
  };
}
