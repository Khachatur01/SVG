import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class NEGrip extends Grip {
  constructor() {
    super("ne-resize");
  }

  setPosition(points: Point[]): void {
    this.position = {
      x: points[1].x,
      y: points[1].y - this.side
    }
  }
}
