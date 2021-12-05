import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class SEGrip extends Grip {
  constructor() {
    super("se-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[2].x,
      y: points[2].y
    }
  }
}
