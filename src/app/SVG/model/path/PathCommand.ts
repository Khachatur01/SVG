import {Point} from "../Point";

export abstract class PathCommand {
  protected _point: Point

  constructor(point: Point) {
    this._point = point;
  }

  get position(): Point {
    return this._point
  }
  set position(position: Point) {

  }

  abstract get command(): string;
  abstract get copy(): PathCommand;
}
