import {Command} from "../../Command";
import {Point} from "../../../Point";

export class Arc extends Command {
  private _rx: number;
  private _ry: number;
  private _x_axis_rotation: number;
  private _large_arc_flag: number;
  private _sweep_flag: number;

  constructor(rx: number, ry: number, xAxisRotation: number, largeArcFlag: number, sweepFlag: number, point: Point) {
    super(point);
    this._rx = rx;
    this._ry = ry;
    this._x_axis_rotation = xAxisRotation;
    this._large_arc_flag = largeArcFlag;
    this._sweep_flag = sweepFlag;
  }

  get command(): string {
    return "A " +
      this._rx + " " + this._ry + " " +
      this._x_axis_rotation + " " +
      this._large_arc_flag + " " +
      this._sweep_flag + " " +
      this._point.x + " " + this._point.y;
  }

  get rx(): number {
    return this._rx;
  }

  set rx(value: number) {
    this._rx = value;
  }

  get ry(): number {
    return this._ry;
  }

  set ry(ry: number) {
    this._ry = ry;
  }

  get xAxisRotation(): number {
    return this._x_axis_rotation;
  }

  set xAxisRotation(xAxisRotation: number) {
    this._x_axis_rotation = xAxisRotation;
  }

  get largeArcFlag(): number {
    return this._large_arc_flag;
  }

  set largeArcFlag(largeArcFlag: number) {
    this._large_arc_flag = largeArcFlag;
  }

  get sweepFlag(): number {
    return this._sweep_flag;
  }

  set sweepFlag(sweepFlag: number) {
    this._sweep_flag = sweepFlag;
  }

  set position(delta: Point) {
    this._point.x += delta.x;
    this._point.y += delta.y;
  }
}
