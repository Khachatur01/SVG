import {Grip} from "./Grip";
import {Point} from "../../../../../model/Point";

export class WGrip extends Grip {
  constructor() {
    super( "w-resize");
  }

  setPosition(points: Point[]): void {
    let x = Math.abs(points[3].x + points[0].x) / 2;
    let y = Math.abs(points[3].y + points[0].y) / 2;
    this.position = {
      x: x - this.side,
      y: y - this.side / 2
    }
  }
}
