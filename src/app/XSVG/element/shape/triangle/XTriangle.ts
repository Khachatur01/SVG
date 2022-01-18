import {XPolygon} from "../../pointed/XPolygon";
import {XSVG} from "../../../XSVG";
import {Point} from "../../../model/Point";

export class XTriangle extends XPolygon {
  constructor(container: XSVG, pointA: Point | null = null, pointB: Point | null = null, pointC: Point | null = null) {
    super(container, (pointA && pointB && pointC) ? [pointA, pointB, pointC] : []);

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  override get copy(): XTriangle {
    return super.copy as XTriangle;
  }
}
