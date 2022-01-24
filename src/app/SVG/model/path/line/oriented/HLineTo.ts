import {LineTo} from "../LineTo";
import {Point} from "../../../Point";

export class HLineTo extends LineTo {
  override get command(): string {
    return "H " + this._point.x;
  }

  override get position(): Point {
    return super.position;
  }

  override set position(position: Point) {
    this._point.y = position.y;
  }
}
