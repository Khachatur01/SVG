import {Element} from "../Element";
import {Point} from "../../model/Point";
import {Size} from "../../model/Size";

export abstract class Foreign extends Element {
  get points(): Point[] {
    let position: Point = this.position;
    let size: Size = this.size;

    return [
      position,
      {x: position.x, y: position.y + size.height},
      {x: position.x + size.width, y: position.y + size.height},
      {x: position.x + size.width, y: position.y},
    ];
  }
}
