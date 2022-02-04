import {PolygonView} from "../PolygonView";
import {SVG} from "../../../../../SVG";
import {Point} from "../../../../../model/Point";

export class TriangleView extends PolygonView {
  public constructor(container: SVG, pointA: Point | null = null, pointB: Point | null = null, pointC: Point | null = null) {
    super(container, (pointA && pointB && pointC) ? [pointA, pointB, pointC] : []);

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  public override get copy(): TriangleView {
    return super.copy as TriangleView;
  }
}
