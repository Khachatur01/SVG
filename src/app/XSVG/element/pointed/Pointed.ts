import {Point} from "../../model/Point";

export interface Pointed {
  get points(): Point[]
  set points(points: Point[]);
  pushPoint(point: Point): void;
  removePoint(index: number): void;
}
