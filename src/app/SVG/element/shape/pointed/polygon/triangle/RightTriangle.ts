import {Triangle} from "./Triangle";
import {SVG} from "../../../../../SVG";
import {Rect} from "../../../../../model/Rect";
import {Point} from "../../../../../model/Point";
import {MoveDrawable} from "../../../../../service/tool/draw/type/MoveDrawable";

export class RightTriangle extends Triangle implements MoveDrawable {
  constructor(container: SVG, rect: Rect | null = null) {
    if (rect) {
      let pointA: Point = {x: rect.x, y: rect.y};
      let pointB: Point = {x: rect.x, y: rect.y + rect.width};
      let pointC: Point = {x: rect.x, y: rect.y};
      super(container, pointA, pointB, pointC);
    } else {
      super(container);
    }
  }

  override get copy(): RightTriangle {
    return super.copy as RightTriangle;
  }

  drawSize(rect: Rect) {
    let points: Point[] = [];
    points.push({ /* A */
      x: rect.x,
      y: rect.y
    });
    points.push({ /* B */
      x: rect.x,
      y: rect.y + rect.height
    });
    points.push({ /* C */
      x: rect.x + rect.width,
      y: rect.y + rect.height
    });

    this.points = points;
  }
}
