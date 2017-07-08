const { intersects } = require('./lib/collision');

describe('collision', () => {
  it('colinear', () => {
    const p1 = { x: 1, y: 1 };
    const q1 = { x: 10, y: 1 };
    const p2 = { x: 1, y: 2 };
    const q2 = { x: 10, y: 2 };

    expect(intersects(p1, q1, p2, q2)).toBeFalsy();
  });

  it('intersecting', () => {
    const p1 = { x: 10, y: 0 };
    const q1 = { x: 0, y: 10 };
    const p2 = { x: 0, y: 0 };
    const q2 = { x: 10, y: 10 };
    expect(intersects(p1, q1, p2, q2)).toEqual({ dx: -5, dy: 5, x: 5, y: 5, p1, q1, p2, q2 });
  });

  it('non-intersecting', () => {
    const p1 = { x: -5, y: -5 };
    const q1 = { x: 0, y: 0 };
    const p2 = { x: 1, y: 1 };
    const q2 = { x: 10, y: 10 };
    expect(intersects(p1, q1, p2, q2)).toBeFalsy();
  });
});
