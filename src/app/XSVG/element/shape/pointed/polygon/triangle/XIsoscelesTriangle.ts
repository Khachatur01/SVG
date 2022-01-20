import {XTriangle} from "./XTriangle";
import {XSVG} from "../../../../../XSVG";
import {Rect} from "../../../../../model/Rect";
import {Point} from "../../../../../model/Point";
import {MoveDrawable} from "../../../../../service/tool/draw/type/MoveDrawable";

export class XIsoscelesTriangle extends XTriangle implements MoveDrawable {
  constructor(container: XSVG, rect: Rect | null = null) {
    if(rect) {
      let pointA: Point = {x: rect.x, y: rect.y};
      let pointB: Point = {x: rect.x, y: rect.y + rect.width};
      let pointC: Point = {x: rect.x, y: rect.y};
      super(container, pointA, pointB, pointC);
    } else {
      super(container);
    }
  }
  override get copy(): XIsoscelesTriangle {
    return super.copy as XIsoscelesTriangle;
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
