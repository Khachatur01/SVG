import {Command} from "../Command";
import {Point} from "../../Point";

export class LineTo extends Command {
  get command(): string {
    return "L " + this._point.x + " " + this._point.y;
  }
  set position(delta: Point) {
    this._point.x += delta.x;
    this._point.y += delta.y;
  }
}
