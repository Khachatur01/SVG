import {LineTo} from "../LineTo";
import {Point} from "../../../Point";

export class VLineTo extends LineTo {
  public override get command(): string {
    return "V " + this._point.y;
  }

  public override get position(): Point {
    return super.position;
  }
  public override set position(position: Point) {
    this._point.y = position.y;
  }
}
