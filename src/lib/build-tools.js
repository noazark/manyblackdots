import { PROP_STATIC, PROP_COLLIDABLE, PROP_KILLER } from './engine';

export const SHAPE = {
  type: 'shape',
  properties: [PROP_STATIC],
  h: 0,
  w: 0,
  x: 0,
  y: 0,
};

export const BASE_OBSTACLE = Object.assign({}, SHAPE, {
  type: 'obstacle',
  color: '#333333',
  properties: [PROP_STATIC, PROP_COLLIDABLE, PROP_KILLER]
});

export const BASE_WALL = Object.assign({}, SHAPE, {
  type: 'wall',
  color: '#999999',
  properties: [PROP_STATIC, PROP_COLLIDABLE]
});

export const BASE_PLATFORM = Object.assign({}, SHAPE, {
  type: 'platform',
  color: '#333333',
  properties: [PROP_STATIC, PROP_COLLIDABLE],
  h: 1
});

export const BASE_HERO = Object.assign({}, SHAPE, {
  type: 'hero',
  color: '#333333',
  properties: [PROP_COLLIDABLE],
  h: 10,
  w: 10,
  x: 30,
  x0: 0,
  y0: 0,
  dx: 0.25,
  dy: 0
});

export function clouds(count=10, xMin=0, xMax=100, yMin=0, yMax=100, config={}) {
  const clouds = [];

  for (let i=0; i < count; i++) {
    clouds.push(Object.assign({}, SHAPE, config, {
      x: Math.random() * (xMax - xMin) + xMin,
      y: Math.random() * (yMax - yMin) + yMin,
      w: Math.random() * 100,
      h: 1
    }));
  }

  return clouds;
}
