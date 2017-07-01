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
      Object.assign({}, BASE_HERO, {
        x: 15 * i,
        y: 250 + 20 * i,
        forceMax: 2,
        accel: (d) => d - 0.15,
        dx: 0
      }),
      Object.assign({}, BASE_PLATFORM, { x: 15 * i, y: 120 - Number(i), w: 10 }),
      Object.assign({}, BASE_OBSTACLE, { x: 15 * i, y: 50, w: 10, h: 50 }),
    ]);
  }

  return {
    map: [
      ...mapItems
    ]
  };
}

// Platforms do not handle horizontal collisions very well
export function verticalPlatform() {
  return {
    map: [
      Object.assign({}, BASE_HERO, {
        x: 30,
        y: 1,
        dx: 0.3,
        force: () => 0
      }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 200, y: 0, w: 1, h: 50 }),
      Object.assign({}, BASE_OBSTACLE, { x: 250, y: 0, w: 10, h: 50 }),
    ]
  };
}

export function jump() {
  return {
    config: {
      cameraX: () => 0
    },
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1, dy: 20 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_OBSTACLE, { x: 50, y: 0, w: 50, h: 50 }),
      Object.assign({}, BASE_OBSTACLE, { x: 300, y: 0, w: 50, h: 9999 }),
    ]
  };
}

export function impossiblePlatform() {
  return {
    config: {
      cameraX: () => 0
    },
    map: [
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),

      Object.assign({}, BASE_HERO, { x: 70, y: 1, dx: 0 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 181, w: 150 }),
      // this platform should not be reachable
      Object.assign({}, BASE_HERO, { x: 220, y: 1, dx: 0 }),
      Object.assign({}, BASE_PLATFORM, { x: 150, y: 180, w: 150 }),
    ]
  };
}
