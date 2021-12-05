import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class SWGrip extends Grip {
  constructor() {
    super("sw-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[3].x - this.side,
      y: points[3].y
    }
  }
}
