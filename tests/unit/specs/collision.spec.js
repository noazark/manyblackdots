import { intersects } from '@/lib/collision'
import {
  detectCollision,
  handleCollisions,
  move,
  initializeLevel,
  PROP_STATIC,
  PROP_COLLIDABLE,
  PROP_KILLER,
  PROP_DRAWABLE,
} from '@/lib/engine'

describe('collision', () => {
  it('colinear', () => {
    const p1 = { x: 1, y: 1 }
    const q1 = { x: 10, y: 1 }
    const p2 = { x: 1, y: 2 }
    const q2 = { x: 10, y: 2 }

    expect(intersects(p1, q1, p2, q2)).toBeFalsy()
  })

  it('intersecting', () => {
    const p1 = { x: 10, y: 0 }
    const q1 = { x: 0, y: 10 }
    const p2 = { x: 0, y: 0 }
    const q2 = { x: 10, y: 10 }
    expect(intersects(p1, q1, p2, q2)).toEqual({ dx: -5, dy: 5, x: 5, y: 5, p1, q1, p2, q2 })
  })

  it('colinear overlapping', () => {
    // Colinear overlapping segments return false because getIntersection
    // cannot compute a single intersection point (denom is 0). This is
    // correct for the game's collision system, which relies on crossing
    // intersections with meaningful displacement values.
    const p1 = { x: 1, y: 1 }
    const q1 = { x: 10, y: 1 }
    const p2 = { x: 5, y: 1 }
    const q2 = { x: 15, y: 1 }
    expect(intersects(p1, q1, p2, q2)).toBeFalsy()
  })

  it('non-intersecting', () => {
    const p1 = { x: -5, y: -5 }
    const q1 = { x: 0, y: 0 }
    const p2 = { x: 1, y: 1 }
    const q2 = { x: 10, y: 10 }
    expect(intersects(p1, q1, p2, q2)).toBeFalsy()
  })
})

describe('engine - fallTest scenario', () => {
  // Reproduces the fallTest level: hero falls onto a platform with a
  // killer obstacle directly beneath it. The hero should land on the
  // platform and survive — the platform shields from the obstacle.
  function makeData(heroY) {
    const hero = {
      type: 'hero',
      properties: [PROP_DRAWABLE, PROP_COLLIDABLE],
      x: 2, y: heroY, x0: 2, y0: 180,
      w: 10, h: 10, dx: 0, dy: -3,
    }
    const platform = {
      type: 'platform',
      properties: [PROP_STATIC, PROP_DRAWABLE, PROP_COLLIDABLE],
      x: 0, y: 110, w: 14, h: 1,
    }
    const obstacle = {
      type: 'obstacle',
      properties: [PROP_STATIC, PROP_DRAWABLE, PROP_COLLIDABLE, PROP_KILLER],
      x: 0, y: -999, w: 14, h: 999 + 100,
    }
    return {
      state: { isAlive: true, isWinner: false },
      map: [hero, platform, obstacle],
    }
  }

  it('hero should survive when platform shields from killer below', () => {
    // Hero has fallen to y=90 (below platform top at 111, and below
    // obstacle top at 100). Both collisions are detected.
    const data = makeData(90)
    const collisions = detectCollision(data, data.map)

    expect(collisions.length).toBeGreaterThanOrEqual(2)

    handleCollisions(data, collisions)

    // Hero should be alive — platform shields from the obstacle
    expect(data.state.isAlive).toBe(true)

    // Hero should be on the platform surface (y = platform.y + platform.h = 111)
    const hero = data.map.find(o => o.type === 'hero')
    expect(hero.y).toBeCloseTo(111, 0)
  })

  it('hero should die when hitting killer directly (no platform)', () => {
    const hero = {
      type: 'hero',
      properties: [PROP_DRAWABLE, PROP_COLLIDABLE],
      x: 2, y: 90, x0: 2, y0: 180,
      w: 10, h: 10, dx: 0, dy: -3,
    }
    const obstacle = {
      type: 'obstacle',
      properties: [PROP_STATIC, PROP_DRAWABLE, PROP_COLLIDABLE, PROP_KILLER],
      x: 0, y: -999, w: 14, h: 999 + 100,
    }
    const data = {
      state: { isAlive: true, isWinner: false },
      map: [hero, obstacle],
    }
    const collisions = detectCollision(data, data.map)
    handleCollisions(data, collisions)

    expect(data.state.isAlive).toBe(false)
  })
})
