import {XPolygon} from "../../pointed/XPolygon";
import {XSVG} from "../../../XSVG";
import {Point} from "../../../model/Point";
import {MoveDrawable} from "../../../service/tool/draw/type/MoveDrawable";
import {Rect} from "../../../model/Rect";

export class XTriangle extends XPolygon implements MoveDrawable {
  constructor(container: XSVG, pointA: Point | null = null, pointB: Point | null = null, pointC: Point | null = null) {
    super(container, (pointA && pointB && pointC) ? [pointA, pointB, pointC] : []);

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  drawSize(rect: Rect): void {
    let points: Point[] = [];
    points.push({ /* A */
      x: rect.x,
      y: rect.y
    });
    points.push({ /* B */
      x: rect.x - rect.width,
      y: rect.y + rect.height
    });
    points.push({ /* C */
      x: rect.x + rect.width,
      y: rect.y + rect.height
    });

    this.points = points;
  }
}
