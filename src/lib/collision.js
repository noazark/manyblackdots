const COLINEAR = 0;
const CLOCKWISE = 1;
const COUNTER_CLOCKWISE = 2;

function onSegment(p, q, r) {
  return (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  );
}

function orientation(p, q, r) {
  // See http://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  // clock or counterclock wise
  return val === 0 ? COLINEAR : val > 0 ? CLOCKWISE : COUNTER_CLOCKWISE;
}

export function getIntersection(p1, q1, p2, q2) {
  const denom = (q2.y - p2.y) * (q1.x - p1.x) - (q2.x - p2.x) * (q1.y - p1.y);
  if (denom === 0) {
    return false;
  }
  const a =
    ((q2.x - p2.x) * (p1.y - p2.y) - (q2.y - p2.y) * (p1.x - p2.x)) / denom;
  const dx = a * (q1.x - p1.x);
  const dy = a * (q1.y - p1.y);
  const x = p1.x + dx;
  const y = p1.y + dy;

  return {
    x,
    y,
    dx,
    dy,
    p1,
    q1,
    p2,
    q2,
  };
}

// The main function that returns true if line segment 'p1q1'
// and 'p2q2' intersect.
export function intersects(p1, q1, p2, q2) {
  // Find the four orientations needed for general and
  // special cases
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  if (
    // General case
    (o1 !== o2 && o3 !== o4) ||
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    (o1 === 0 && onSegment(p1, p2, q1)) ||
    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    (o2 === 0 && onSegment(p1, q2, q1)) ||
    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    (o3 === 0 && onSegment(p2, p1, q2)) ||
    // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    (o4 === 0 && onSegment(p2, q1, q2))
  ) {
    return getIntersection(p1, q1, p2, q2);
  }

  return false;
}
