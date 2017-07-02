import { BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM } from '../lib/build-tools';

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
        accel() {
          return { dy: this.dy - 0.15, dx: 0 };
        },
        dx: 0
      }),
      Object.assign({}, BASE_PLATFORM, { x: 15 * i, y: 110, w: 10 }),
      Object.assign({}, BASE_OBSTACLE, { x: 15 * i, y: 50, w: 10, h: 50 }),
    ]);
  }

  return {
    config: {
      cameraX() {
        return 0;
      },
      showCollisions: true
    },
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
        force() {
          return 0;
        }
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
      cameraX() {
        return 0;
      }
    },
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1, dy: 2 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_OBSTACLE, { x: 50, y: 0, w: 50, h: 50 }),
      Object.assign({}, BASE_OBSTACLE, { x: 300, y: 0, w: 50, h: 9999 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -10, w: 99999, h: 0 }),
    ]
  };
}

export function impossiblePlatform() {
  function accel(data) {
    if (data.state.up) {
      return {
        dy: this.dy + 0.057,
        dx: 0
      };
    } else {
      return {
        dy: this.dy - 0.109,
        dx: 0
      };
    }
  }
  return {
    config: {
      cameraX() {
        return 0;
      },
    },
    map: [
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 50, w: 300 }),

      Object.assign({}, BASE_HERO, { x: 70, y: 51, dx: 0, accel }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 92, w: 150 }),
      // this platform should not be reachable
      Object.assign({}, BASE_HERO, { x: 220, y: 51, dx: 0, accel }),
      Object.assign({}, BASE_PLATFORM, { x: 150, y: 91, w: 150 }),
    ]
  };
}

export function thinGap() {
  let mapItems = [];

  for (let i = 0; i < 50; i++) {
    mapItems = mapItems.concat([
      Object.assign({}, BASE_PLATFORM, { x: 100 * i, y: 50, w: 100 - Number(i) }),
    ]);
  }

  return {
    config: {
      showCollisions: true
    },
    map: [
      ...mapItems,
      Object.assign({}, BASE_HERO, {
        x: 30,
        y: 51,
        dx: 3
      }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: 0, w: 99999, h: 10 }),
    ]
  };
}
