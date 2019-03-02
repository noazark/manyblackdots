import { BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM, BASE_WALL, CAMERA } from '@/lib/build-tools'
import { strip } from '@/utils/string'

export const ladder = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_OBSTACLE, { w: 99999, y: -100 }),

    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 200, y: 6, w: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 400, y: 11, w: 300 })
  ]
}

export const fallTest = {
  config: {
    showCollisions: true,
    description: strip`
      demonstrates issues with collision
      detection around two near collidables

      play a few times to see the various responses`
  },
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 2, y: 180, dx: 0 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 110, w: 14 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -999, w: 14, h: 999 + 100 })
  ]
}

export const verticalPlatform = {
  config: {
    description: strip`
      Platforms do not handle horizontal collisions very well`
  },
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, {
      x: 30,
      y: 1,
      dx: 0.3
    }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 200, y: 0, w: 1, h: 50 }),
    Object.assign({}, BASE_OBSTACLE, { x: 250, y: 0, w: 10, h: 50 })
  ]
}

const jumpObstacles = []

for (let i = 0; i < 30; i++) {
  jumpObstacles.push(Object.assign({}, BASE_OBSTACLE, { x: 200 + 300 * i, y: 0, w: 10, h: 10 * i + 1 }))
}

export const jump = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, {
      x: 30,
      y: 1
    }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 99999 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),
    ...jumpObstacles
  ]
}

export const impossiblePlatform = {
  config: {
    description: strip`
    this platform shouldn't be reachable
    `
  },
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),

    Object.assign({}, BASE_HERO, { x: 30, y: 1, dx: 0 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 140, w: 150 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: 270, w: 150, h: 20 })
  ]
}

export const impossibleTrampoline = {
  config: {
    description: strip`
    Bounce bounce bounce
    `
  },
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 300 }),

    Object.assign({}, BASE_HERO, { x: 30, y: 1, dx: 0 }),
    Object.assign({}, BASE_PLATFORM, { x: 40, y: 50, w: 50 }),
    Object.assign({}, BASE_PLATFORM, { x: -20, y: 50, w: 50 }),
  ]
}

let thinGapMapItems = []

for (let i = 0; i < 500; i++) {
  thinGapMapItems = thinGapMapItems.concat([
    Object.assign({}, BASE_PLATFORM, { x: 100 * i, y: 50, w: 100 - Number(i*2) })
  ])
}

export const thinGap = {
  config: {
    showCollisions: true
  },
  map: [
    Object.assign({}, CAMERA),
    ...thinGapMapItems,
    Object.assign({}, BASE_HERO, {
      x: 30,
      y: 52
    }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: 0, w: 99999, h: 10 })
  ]
}

const chunkPadsMapItems = []

for (let i = 0; i < 50; i++) {
  chunkPadsMapItems.push(Object.assign({}, BASE_PLATFORM, { x: 450 + 150 * i, y: 50, w: 100 - Number(i) }))
}

export const chunkPads = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 450 }),
    ...chunkPadsMapItems,
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
  ]
}

export const chunkBedHop = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 900 }),
    Object.assign({}, BASE_PLATFORM, { x: 450, y: 50, w: 200 }),
    Object.assign({}, BASE_OBSTACLE, { x: 400, y: 0, w: 300, h: 20 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
  ]
}

export const chunkTreeTrunk = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 900 }),
    Object.assign({}, BASE_OBSTACLE, { x: 450, y: 0, w: 20, h: 60 }),
    Object.assign({}, BASE_PLATFORM, { x: 500, y: 100, w: 100 }),
    Object.assign({}, BASE_OBSTACLE, { x: 600, y: 30, w: 20, h: 150 }),
    Object.assign({}, BASE_PLATFORM, { x: 620, y: 150, w: 100 }),
    Object.assign({}, BASE_OBSTACLE, { x: 700, y: 0, w: 20, h: 80 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 })
  ]
}

// should probably make this more generic and just call it a "repeatable"
function stairs (config) {
  const stairs = []

  for (let i = 1; i <= config.count; i++) {
    const w = config.stepWidth
    const x = config.x + w * i
    const h = config.stepHeight * i
    const obstacleH = h - config.gap
    const platformX = x - config.overhang

    stairs.push(Object.assign({}, BASE_PLATFORM, { x: platformX, y: h, w }))
    stairs.push(Object.assign({}, BASE_OBSTACLE, { x, y: 0, w, h: obstacleH }))
  }

  return stairs
}

export const chunkStairCase = {
  map: [
    Object.assign({}, CAMERA),
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
}

export const chunkTightLeap = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 400 }),
    Object.assign({}, BASE_OBSTACLE, { x: 450, y: 120, w: 20, h: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 520, y: 0, w: 300 }),

    Object.assign({}, BASE_OBSTACLE, { x: 840, y: 80, w: 20, h: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 880, y: 0, w: 300 })
  ]
}

export const chunkFlamingDeath = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 500 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

    Object.assign({}, BASE_OBSTACLE, { x: 290, y: 0, w: 20, h: 40 }),
    Object.assign({}, BASE_OBSTACLE, { x: 290, y: 80, w: 20, h: 300 })
  ]
}

export const chunkShortDrop = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 51 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 50, w: 250 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

    Object.assign({}, BASE_OBSTACLE, { x: 290, y: 55, w: 20, h: 300 }),
    Object.assign({}, BASE_WALL, { x: 450, y: 80, w: 10, h: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 275, y: 10, w: 50 }),
    Object.assign({}, BASE_PLATFORM, { x: 400, y: 80, w: 500 })
  ]
}

export const chunkWallGap = {
  map: [
    Object.assign({}, CAMERA),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 1500 }),
    Object.assign({}, BASE_OBSTACLE, { x: 0, y: -100, w: 99999, h: 0 }),

    Object.assign({}, BASE_PLATFORM, { x: 0, y: 80, w: 900 }),
    Object.assign({}, BASE_WALL, { x: 0, y: 70, w: 400, h: 10 }),
    Object.assign({}, BASE_WALL, { x: 500, y: 70, w: 400, h: 10 }),
    Object.assign({}, BASE_PLATFORM, { x: 1000, y: 80, w: 500 }),
    Object.assign({}, BASE_WALL, { x: 1000, y: 70, w: 500, h: 10 })
  ]
}
