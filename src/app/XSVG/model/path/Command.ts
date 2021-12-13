import {Point} from "../Point";

export abstract class Command {
  protected _point: Point

  constructor(point: Point) {
    this._point = point;
  }

  get point(): Point {
    return this._point;
  }
  set point(point: Point) {
    this._point = point;
  }
  abstract set position(position: Point);

  abstract get command(): string;
}
