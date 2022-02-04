import {PathCommand} from "../PathCommand";
import {Point} from "../../Point";

export class MoveTo extends PathCommand {
  public get command(): string {
    return "M " + this._point.x + " " + this._point.y;
  }

  public override get position(): Point {
    return super.position;
  }
  public override set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }

  public get copy(): MoveTo {
    return new MoveTo({
      x: this._point.x,
      y: this._point.y
    });
  }
}

