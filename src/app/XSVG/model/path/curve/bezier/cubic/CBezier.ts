import {Command} from "../../../Command";
import {Point} from "../../../../Point";

export class CBezier extends Command {
  private _cPoint0: Point;
  private _cPoint1: Point;
  constructor(cPoint0: Point, cPoint1: Point, point: Point) {
    super(point);
    this._cPoint0 = cPoint0;
    this._cPoint1 = cPoint1;
  }
  get command(): string {
    return "C " +
      this._cPoint0.x + " " + this._cPoint0.y + ", " +
      this._cPoint1.x + " " + this._cPoint1.y + ", " +
      this._point.x + " " + this._point.y;
  }

  get cPoint0(): Point {
    return this._cPoint0;
  }
  set cPoint0(point: Point) {
    this._cPoint0 = point;
  }
  get cPoint1(): Point {
    return this._cPoint1;
  }
  set cPoint1(point: Point) {
    this._cPoint1 = point;
  }

  set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;

    this._cPoint0.x = position.x;
    this._cPoint0.y = position.y;
    this._cPoint1.x = position.x;
    this._cPoint1.y = position.y;
  }
}
