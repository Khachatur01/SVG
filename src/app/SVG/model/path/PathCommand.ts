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
    this._point = {
      x: position.x,
      y: position.y
    }
  }

  abstract get command(): string;
  abstract get copy(): PathCommand;
}
