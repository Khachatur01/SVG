import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class NGrip extends Grip {
  constructor() {
    super("n-resize");
  }

  setPosition(points: Point[]): void {
    let x = Math.abs(points[1].x + points[0].x) / 2;
    let y = Math.abs(points[1].y + points[0].y) / 2;
    this.position = {
      x: x - this.side + this.side / 2,
      y: y - this.side
    }
  }
}
