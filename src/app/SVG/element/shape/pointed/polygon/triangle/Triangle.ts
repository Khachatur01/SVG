import {Polygon} from "../Polygon";
import {SVG} from "../../../../../SVG";
import {Point} from "../../../../../model/Point";

export class Triangle extends Polygon {
  constructor(container: SVG, pointA: Point | null = null, pointB: Point | null = null, pointC: Point | null = null) {
    super(container, (pointA && pointB && pointC) ? [pointA, pointB, pointC] : []);

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  override get copy(): Triangle {
    return super.copy as Triangle;
  }
}
