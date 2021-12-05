import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class EGrip extends Grip {
  constructor() {
    super("e-resize");
  }

  setPosition(points: Point[]): void {
    let x = Math.abs(points[2].x + points[1].x) / 2;
    let y = Math.abs(points[2].y + points[1].y) / 2;
    this.position = {
      x: x,
      y: y - this.side / 2
    }
  }
}
