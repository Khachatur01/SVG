import {LineTo} from "../LineTo";
import {Point} from "../../../Point";

export class VLineTo extends LineTo {
  override get command(): string {
    return "V " + this._point.y;
  }

  override get position(): Point {
    return super.position;
  }
  override set position(position: Point) {
    this._point.y = position.y;
  }
}
