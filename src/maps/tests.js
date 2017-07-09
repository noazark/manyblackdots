import { BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM, BASE_WALL } from '@/lib/build-tools';

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
//
// All platforms and obstacles should be at least 1 pixel wider than hero
export function fallTest() {
  let mapItems = [];

  for (let i = 0; i < 1; i++) {
    mapItems = mapItems.concat([
      Object.assign({}, BASE_HERO, {
        x: 15 * i,
        y: 180 + 20 * i,
        dx: 0
      }),
      Object.assign({}, BASE_PLATFORM, { x: 15 * i - 2, y: 110, w: 14 }),
      Object.assign({}, BASE_OBSTACLE, { x: 15 * i - 2, y: -999, w: 14, h: 999 + 100 }),
    ]);
  }

  return {
    config: {
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
        dx: 0.3
      }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 200, y: 0, w: 1, h: 50 }),
      Object.assign({}, BASE_OBSTACLE, { x: 250, y: 0, w: 10, h: 50 }),
    ]
  };
}

export function jump() {
  const obstacles = [];

  for (let i=0; i < 30; i++) {
    obstacles.push(Object.assign({}, BASE_OBSTACLE, { x: 200 + 300 * i, y: 0, w: 10, h: 10 * i + 1 }));
  }

  return {
    map: [
      Object.assign({}, BASE_HERO, {
        x: 30,
        y: 1
      }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 99999 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),
      ...obstacles,
    ]
  };
}

export function impossiblePlatform() {
  return {
    map: [
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 50, w: 300 }),

      Object.assign({}, BASE_HERO, { x: 70, y: 51, dx: 0 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 92, w: 150 }),
      // this platform should not be reachable
      Object.assign({}, BASE_HERO, { x: 220, y: 51, dx: 0 }),
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
        y: 52,
        dx: 0.1
      }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: 0, w: 99999, h: 10 }),
    ]
  };
}

export function chunkPads() {
  const pads = [];

  for (let i = 0; i < 50; i++) {
    pads.push(Object.assign({}, BASE_PLATFORM, { x: 450 + 150 * i, y: 50, w: 100 - Number(i) }));
  }

  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 450 }),
      ...pads,
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
    ]
  };
}

export function chunkBedHop() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 900 }),
      Object.assign({}, BASE_PLATFORM, { x: 450, y: 50, w: 200 }),
      Object.assign({}, BASE_OBSTACLE, { x: 400, y: 0, w: 300, h: 20 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
    ]
  };
}

export function chunkTreeTrunk() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 900 }),
      Object.assign({}, BASE_OBSTACLE, { x: 450, y: 0, w: 20, h: 60 }),
      Object.assign({}, BASE_PLATFORM, { x: 500, y: 100, w: 100 }),
      Object.assign({}, BASE_OBSTACLE, { x: 600, y: 30, w: 20, h: 150 }),
      Object.assign({}, BASE_PLATFORM, { x: 620, y: 150, w: 100 }),
      Object.assign({}, BASE_OBSTACLE, { x: 700, y: 0, w: 20, h: 80 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
    ]
  };
}

export function chunkStairCase() {
  // should probably make this more generic and just call it a "repeatable"
  function stairs(config) {
    const stairs = [];

    for (let i=1; i <= config.count; i++) {
      const w = config.stepWidth;
      const x = config.x + w * i;
      const y = config.y;
      const h = config.stepHeight * i;
      const obstacleH = h - config.gap;
      const platformX = x - config.overhang;

      stairs.push(Object.assign({}, BASE_PLATFORM, { x: platformX, y: h, w }));
      stairs.push(Object.assign({}, BASE_OBSTACLE, { x, y: 0, w, h: obstacleH }));
    }

    return stairs;
  }

  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 900 }),
      ...stairs({
        count: 4,
        x: 450,
        y: 0,
        stepHeight: 30,
        stepWidth: 150,
        gap: 10,
        overhang: 75
      }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
    ]
  };
}

export function chunkTightLeap() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 400 }),
      Object.assign({}, BASE_OBSTACLE, { x: 450, y: 120, w: 20, h: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 520, y: 0, w: 300 }),

      Object.assign({}, BASE_OBSTACLE, { x: 840, y: 80, w: 20, h: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 880, y: 0, w: 300 }),
    ]
  };
}

export function chunkFlamingDeath() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 500 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

      Object.assign({}, BASE_OBSTACLE, { x: 290, y: 0, w: 20, h: 40 }),
      Object.assign({}, BASE_OBSTACLE, { x: 290, y: 80, w: 20, h: 300 }),
    ]
  };
}

export function chunkShortDrop() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 51 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 50, w: 250 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

      Object.assign({}, BASE_OBSTACLE, { x: 290, y: 55, w: 20, h: 300 }),
      Object.assign({}, BASE_WALL, { x: 450, y: 80, w: 10, h: 300 }),
      Object.assign({}, BASE_PLATFORM, { x: 275, y: 10, w: 50 }),
      Object.assign({}, BASE_PLATFORM, { x: 400, y: 80, w: 500 }),
    ]
  };
}

export function chunkWallGap() {
  return {
    map: [
      Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
      Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 1500 }),
      Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

      Object.assign({}, BASE_PLATFORM, { x: 0, y: 80, w: 900 }),
      Object.assign({}, BASE_WALL, { x: 0, y: 70, w: 400, h: 10 }),
      Object.assign({}, BASE_WALL, { x: 500, y: 70, w: 400, h: 10 }),
      Object.assign({}, BASE_PLATFORM, { x: 1000, y: 80, w: 500 }),
      Object.assign({}, BASE_WALL, { x: 1000, y: 70, w: 500, h: 10 }),
    ]
  };
}
