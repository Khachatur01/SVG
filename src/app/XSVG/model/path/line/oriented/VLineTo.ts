import {LineTo} from "../LineTo";
import {Point} from "../../../Point";

export class VLineTo extends LineTo {
  override get command(): string {
    return "V " + this._point.y;
  }

  override set position(delta: Point) {
    this._point.y += delta.y;
  }
}
