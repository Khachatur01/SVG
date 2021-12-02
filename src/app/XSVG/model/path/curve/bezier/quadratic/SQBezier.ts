import {Command} from "../../../Command";
import {Point} from "../../../../Point";

export class SQBezier extends Command {
  get command(): string {
    return "T " +
      this._point.x + " " + this._point.y;
  }
  set position(delta: Point) {
    this._point.x += delta.x;
    this._point.y += delta.y;
  }
}
