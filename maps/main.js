import { clouds, BASE_HERO, BASE_OBSTACLE, BASE_PLATFORM } from '../lib/build-tools';

export function level1() {
  return {
    map: [
      ...clouds(100, 0, 3000, 150, 300, { color: '#dfdfdf' }),
      Object.assign({}, BASE_HERO, { x: 30, y: 2 }),
      Object.assign({}, BASE_OBSTACLE, { w: 99999, y: -100 }),
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
  };
}
