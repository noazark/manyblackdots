import { clouds, BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM, BASE_WIN_ZONE } from '@/lib/build-tools';
import { strip } from '@/utils/string'

export const level1 = {
  config: {
    name: 'Level 1',
    description: strip`
      press any button to begin
      press any button to jump`,
    nextLevel: 'level2',
  },
  map: [
    Object.assign({}, BASE_WIN_ZONE, { w: 1000, h: 1000, x: 2050, y: 0 }),
    ...clouds(100, 0, 2850, 150, 300, { color: '#dfdfdf' }),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_OBSTACLE, { w: 2850, y: -100 }),
    Object.assign({}, BASE_PLATFORM, { x: 0, y: 0, w: 1200 }),
    Object.assign({}, BASE_PLATFORM, { x: 1250, w: 300 }),
    Object.assign({}, BASE_PLATFORM, { x: 1800, w: 500 }),
    Object.assign({}, BASE_PLATFORM, { x: 1450, y: 50, w: 400 }),
    Object.assign({}, BASE_OBSTACLE, { w: 20, y: 0, h: 10, x: 450 }),
    Object.assign({}, BASE_OBSTACLE, { w: 20, y: 0, h: 10, x: 750 }),
    Object.assign({}, BASE_OBSTACLE, { w: 20, y: 0, h: 50, x: 900 }),
    Object.assign({}, BASE_OBSTACLE, { w: 20, y: 150, h: 1500, x: 1800 }),
  ]
}

export const level2 = {
  config: {
    name: 'Level 2',
    description: strip`
      Rinse & repeat`
  },
  map: [
    Object.assign({}, BASE_WIN_ZONE, { w: 1000, h: 1000, x: 3200, y: 0 }),
    ...clouds(100, 0, 4150, 150, 300, { color: '#dfdfdf' }),
    Object.assign({}, BASE_HERO, { x: 30, y: 1 }),
    Object.assign({}, BASE_OBSTACLE, { w: 4200, y: -100 }),
    Object.assign({}, BASE_PLATFORM, { y: 0, w: 300 }),
    Object.assign({}, BASE_PLATFORM, { w: 100, x: 200, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 500, x: 400, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 50, x: 1000, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 50, x: 1150, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 50, x: 1300, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 50, x: 1450, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 500, x: 1650, y: 40 }),
    Object.assign({}, BASE_PLATFORM, { w: 200, x: 2150, y: 160 }),
    Object.assign({}, BASE_PLATFORM, { w: 300, x: 2530, y: 70 }),
    Object.assign({}, BASE_PLATFORM, { w: 150, x: 2610, y: 120 }),
    Object.assign({}, BASE_OBSTACLE, { w: 20, y: 190, h: 1000, x: 2860 }),
    Object.assign({}, BASE_PLATFORM, { w: 200, x: 2950, y: 160 }),
  ]
}
