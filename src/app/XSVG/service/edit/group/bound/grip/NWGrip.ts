import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class NWGrip extends Grip {
  constructor() {
    super("nw-resize");
  }

  setPosition(points: Point[]) {
    this.position = {
      x: points[0].x - this.side,
      y: points[0].y - this.side
    }
  }
}
