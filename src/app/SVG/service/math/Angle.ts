import {Point} from "../../model/Point";

export class Angle {
  static snapLineEnd(x1: number, x2: number, y1: number, y2: number): object {
    return snapLineEnd(x1, x2, y1, y2);
  }

  static fromPoints(A: Point, B: Point, C: Point) {
    let AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    let BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    let AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

    let degree = radToDeg(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)));
    if (C.y > A.y)
      degree = 360 - degree;

    return degree;
  }

  static lineFromVector(startPoint: Point, angle: number, length: number): Point {
    return coordsFromVector(startPoint.x, startPoint.y, angle, length) as Point;
  }

  static lineLength(startPoint: Point, endPoint: Point) {
    return lengthFromCoords(startPoint.x, endPoint.x, startPoint.y, endPoint.y);
  }
}

const ANGULAR_SNAP = 15;

// Returns snapped end coordinates - { x2, y2 }
function snapLineEnd(x1: number, x2: number, y1: number, y2: number): object {
  const length = lengthFromCoords(x1, x2, y1, y2);
  const snapAngle = snapAngleFromCoords(x1, x2, y1, y2);

  return coordsFromVector(x1, y1, snapAngle, length);
}

// Angle is calculated by vector coordinates within 360°
function angleFromCoords(x1: number, x2: number, y1: number, y2: number): number {

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  // Angle of the right-triangle formed by coords
  const tAngle = radToDeg(Math.atan(dy / dx))

  let corrected: number;

  // Corrector angle by quadrants
  if (y2 < y1) {
    if (x2 > x1) {                // I
      corrected = tAngle;
    } else {                      // II
      corrected = 180 - tAngle;
    }
  } else {
    if (x2 < x1) {                // III
      corrected = 180 + tAngle;
    } else {                      // IV
      corrected = 360 - tAngle;
    }
  }

  return corrected;
}

function snapAngleFromCoords(x1: number, x2: number, y1: number, y2: number): number {

  const realAngle = angleFromCoords(x1, x2, y1, y2);
  const rem = realAngle % ANGULAR_SNAP;

  let quot = Math.floor(realAngle / ANGULAR_SNAP);
  if (rem > ANGULAR_SNAP / 2) {
    quot++;
  }
  return quot * ANGULAR_SNAP;
}

// Returns end coordinates of vector - { x2, y2 }
function coordsFromVector(x1: number, y1: number, angle: number, length: number): object {

  // Rounding 360°+ angles and normalize negatives
  const rAngle = angle % 360;
  const nAngle = rAngle >= 0 ? rAngle : 360 + rAngle;

  const quad = Math.floor(nAngle / 90) + 1;

  // Delta angle of right-triangle
  let dAngle = nAngle % 90;
  switch (quad) {
    case 2: {
      dAngle = 180 - nAngle;
      break;
    }
    case 3: {
      dAngle = nAngle - 180;
      break;
    }
    case 4: {
      dAngle = 360 - nAngle;
    }
  }

  const dAngleRad = degToRad(dAngle);

  // Negative length is ignored - delta is always positive
  const dx = Math.cos(dAngleRad) * Math.abs(length);
  const dy = Math.sin(dAngleRad) * Math.abs(length);

  // Quadrant IV by default
  let x2 = x1 + dx;
  let y2 = y1 + dy;

  // Switch by quadrants if other than IV
  switch (quad) {
    case 1: {
      y2 = y1 - dy;
      break;
    }
    case 2: {
      x2 = x1 - dx;
      y2 = y1 - dy;
      break;
    }
    case 3: {
      x2 = x1 - dx;
      break;
    }
  }
  return {x: x2, y: y2};
}


// HELPER FUNCTIONS

function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

function degToRad(degrees: number): number {
  return degrees * Math.PI / 180;
}

function lengthFromCoords(x1: number, x2: number, y1: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
