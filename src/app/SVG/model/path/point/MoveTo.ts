import {PathCommand} from "../PathCommand";
import {Point} from "../../Point";

export class MoveTo extends PathCommand {
  get command(): string {
    return "M " + this._point.x + " " + this._point.y;
  }

  override get position(): Point {
    return super.position;
  }

  override set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }

  get copy(): MoveTo {
    return new MoveTo({
      x: this._point.x,
      y: this._point.y
    });
  }
}

