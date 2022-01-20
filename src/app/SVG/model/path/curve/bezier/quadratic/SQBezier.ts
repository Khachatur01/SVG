import {PathCommand} from "../../../PathCommand";
import {Point} from "../../../../Point";

export class SQBezier extends PathCommand {
  get command(): string {
    return "T " +
      this._point.x + " " + this._point.y;
  }
  override get position(): Point {
    return super.position;
  }
  override set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }
  get copy(): SQBezier {
    return new SQBezier({
      x: this._point.x,
      y: this._point.y
    });
  }
}
