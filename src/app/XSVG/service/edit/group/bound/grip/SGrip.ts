import {Point} from "../../../../../model/Point";
import {Grip} from "./Grip";

export class SGrip extends Grip {
  constructor() {
    super("s-resize");
  }

  setPosition(points: Point[]): void {
    let x = Math.abs(points[3].x + points[2].x) / 2;
    let y = Math.abs(points[3].y + points[2].y) / 2;
    this.position = {
      x: x - this.side / 2,
      y: y
    }
  }
}
