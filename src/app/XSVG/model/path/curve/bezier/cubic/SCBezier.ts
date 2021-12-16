import {Command} from "../../../Command";
import {Point} from "../../../../Point";

export class SCBezier extends Command {
  private _cPoint1: Point;
  constructor(cPoint1: Point, point: Point) {
    super(point);
    this._cPoint1 = cPoint1;
  }
  get command(): string {
    return "S " +
      this._cPoint1.x + " " + this._cPoint1.y + ", " +
      this._point.x + " " + this._point.y;
  }

  get cPoint1(): Point {
    return this._cPoint1;
  }
  set cPoint1(point: Point) {
    this._cPoint1 = point;
  }

  override get position(): Point {
    return super.position;
  }
  override set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;

    this._cPoint1.x = position.x;
    this._cPoint1.y = position.y;
  }
  get copy(): SCBezier {
    return new SCBezier({
      x: this._cPoint1.x,
      y: this._cPoint1.y
    }, {
      x: this._point.x,
      y: this._point.y
    });
  }
}
