import {Command} from "../Command";
import {Point} from "../../Point";

export class MoveTo extends Command {
  get command(): string {
    return "M " + this._point.x + " " + this._point.y;
  }

  set position(position: Point) {
    this._point.x = position.x;
    this._point.y = position.y;
  }

  get copy(): MoveTo {
    let command: MoveTo = new MoveTo(this._point);
    return command;
  }
}

