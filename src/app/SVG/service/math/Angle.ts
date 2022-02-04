import {Point} from "../../model/Point";

export class Angle {
  public static SNAP_ANGLE = 15;

  public static fromPoints(A: Point, B: Point, C: Point): number {
    let AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    let BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    let AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

    let degree = Angle.radToDeg(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)));
    if (C.y > A.y)
      degree = 360 - degree;

    return degree;
  }
  // Returns snapped end coordinates - { x2, y2 }
  public static snapLineEnd(start: Point, end: Point): Point {
    const length = Angle.lineLength(start, end);
    const snapAngle = Angle.snapAngleFromCoords(start, end);

    return Angle.lineFromVector(start, snapAngle, length);
  }

  // Angle is calculated by vector coordinates within 360°
  public static angleFromCoords(start: Point, end: Point): number {
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    // Angle of the right-triangle formed by coords
    const tAngle = Angle.radToDeg(Math.atan(dy / dx))

    let corrected: number;

    // Corrector angle by quadrants
    if (end.y < start.y) {
      if (end.x > start.x) {                // I
        corrected = tAngle;
      } else {                              // II
        corrected = 180 - tAngle;
      }
    } else {
      if (end.x < start.x) {                // III
        corrected = 180 + tAngle;
      } else {                              // IV
        corrected = 360 - tAngle;
      }
    }

    return corrected;
  }

  public static snapAngleFromCoords(start: Point, end: Point): number {
    const realAngle = Angle.angleFromCoords(start, end);
    const rem = realAngle % Angle.SNAP_ANGLE;

    let quot = Math.floor(realAngle / Angle.SNAP_ANGLE);
    if (rem > Angle.SNAP_ANGLE / 2) {
      quot++;
    }
    return quot * Angle.SNAP_ANGLE;
  }

  // Returns end coordinates of vector - { x2, y2 }
  public static lineFromVector(start: Point, angle: number, length: number): Point {

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

    const dAngleRad = Angle.degToRad(dAngle);

    // Negative length is ignored - delta is always positive
    const dx = Math.cos(dAngleRad) * Math.abs(length);
    const dy = Math.sin(dAngleRad) * Math.abs(length);

    // Quadrant IV by default
    let x2 = start.x + dx;
    let y2 = start.y + dy;

    // Switch by quadrants if other than IV
    switch (quad) {
      case 1: {
        y2 = start.y - dy;
        break;
      }
      case 2: {
        x2 = start.x - dx;
        y2 = start.y - dy;
        break;
      }
      case 3: {
        x2 = start.x - dx;
        break;
      }
    }
    return {x: x2, y: y2};
  }


  // HELPER FUNCTIONS
  public static radToDeg(radians: number): number {
    return radians * 180 / Math.PI;
  }
  public static degToRad(degrees: number): number {
    return degrees * Math.PI / 180;
  }
  public static lineLength(start: Point, end: Point): number {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  }
}
