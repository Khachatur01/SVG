import {PathCommand} from "../PathCommand";
import {Point} from "../../Point";

export class LineTo extends PathCommand {
  get command(): string {
    return "L " + this._point.x + " " + this._point.y;
  }

  override get position(): Point {
    return super.position;
  }

  override set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }

  get copy(): LineTo {
    return new LineTo({
      x: this._point.x,
      y: this._point.y
    });
  }
}
