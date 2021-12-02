import {Command} from "../../../Command";
import {Point} from "../../../../Point";

export class QBezier extends Command {
  private _cPoint: Point;
  constructor(cPoint: Point, point: Point) {
    super(point);
    this._cPoint = cPoint;
  }
  get command(): string {
    return "Q " +
      this._cPoint.x + " " + this._cPoint.y + ", " +
      this._point.x + " " + this._point.y;
  }

  get cPoint(): Point {
    return this._cPoint;
  }
  set cPoint(point: Point) {
    this._cPoint = point;
  }

  set position(delta: Point) {
    this._point.x += delta.x;
    this._point.y += delta.y;

    this._cPoint.x += delta.x;
    this._cPoint.y += delta.y;
  }
}
