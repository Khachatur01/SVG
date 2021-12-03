import {Command} from "../../../Command";
import {Point} from "../../../../Point";

export class SQBezier extends Command {
  get command(): string {
    return "T " +
      this._point.x + " " + this._point.y;
  }
  set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }
}
