function onSegment(p, q, r) {
  return q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y);
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
  // See http://www.geeksforgeeks.org/orientation-3-ordered-points/
  // for details of below formula.
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val === 0) {
    return 0;
  }

  // clock or counterclock wise
  return val > 0 ? 1 : 2;
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

  // General case
  if (o1 != o2 && o3 != o4) {
    return true;
  }

  // Special Cases
  // p1, q1 and p2 are colinear and p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }

  // p1, q1 and p2 are colinear and q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }

  // p2, q2 and p1 are colinear and p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }

  // p2, q2 and q1 are colinear and q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  // Doesn't fall in any of the above cases
  return false;
}

// let p1 = { x: 1, y: 1 };
// let q1 = { x: 10, y: 1 };
// let p2 = { x: 1, y: 2 };
// let q2 = { x: 10, y: 2 };
//
// console.log(doIntersect(p1, q1, p2, q2) ? "Yes" : "No");
//
// p1 = { x: 10, y: 0 };
// q1 = { x: 0, y: 10 };
// p2 = { x: 0, y: 0 };
// q2 = { x: 10, y: 10 };
// console.log(doIntersect(p1, q1, p2, q2) ? "Yes" : "No");
//
// p1 = { x: -5, y: -5 };
// q1 = { x: 0, y: 0 };
// p2 = { x: 1, y: 1 };
// q2 = { x: 10, y: 10 };
// console.log(doIntersect(p1, q1, p2, q2) ? "Yes" : "No");
