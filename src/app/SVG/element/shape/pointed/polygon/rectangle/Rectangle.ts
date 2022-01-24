import {Size} from "../../../../../model/Size";
import {Polygon} from "../Polygon";
import {Rect} from "../../../../../model/Rect";
import {Point} from "../../../../../model/Point";
import {SVG} from "../../../../../SVG";
import {MoveDrawable} from "../../../../../service/tool/draw/type/MoveDrawable";

/*
*  0_____1
*  |     |
* 3|_____|2
* */

export class Rectangle extends Polygon implements MoveDrawable {
  constructor(container: SVG, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(container, [
      /* 0 */                                             /* 1 */
      {x: x, y: y}, {x: width + x, y: y},
      {x: width + x, y: height + y}, {x: x, y: height + y}
      /* 2 */                                             /* 3 */

    ]);

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  override get copy(): Rectangle {
    return super.copy as Rectangle;
  }

  override get size(): Size {
    return super.size;
  }

  /*
      This function sets size on drawing.
      Elements, which draw by moving,
      that elements must set size different on drawing
  */
  drawSize(rect: Rect) {
    let points: Point[] = [];
    points.push({ /* 0 */
      x: rect.x,
      y: rect.y
    });
    points.push({ /* 1 */
      x: rect.x + rect.width,
      y: rect.y
    });
    points.push({ /* 2 */
      x: rect.x + rect.width,
      y: rect.y + rect.height
    });
    points.push({ /* 3 */
      x: rect.x,
      y: rect.y + rect.height
    });

    this.points = points;
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }
}
