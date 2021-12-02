import {Command} from "../Command";
import {Point} from "../../Point";

export class MoveTo extends Command {
  get command(): string {
    return "M " + this._point.x + " " + this._point.y;
  }

  set position(delta: Point) {
    this._point.x += delta.x;
    this._point.y += delta.y;
  }
}

