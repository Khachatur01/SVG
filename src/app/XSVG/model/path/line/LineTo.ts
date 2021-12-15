import {Command} from "../Command";
import {Point} from "../../Point";

export class LineTo extends Command {
  get command(): string {
    return "L " + this._point.x + " " + this._point.y;
  }
  set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }
  get copy(): LineTo {
    let command: LineTo = new LineTo(this._point);
    return command;
  }
}
