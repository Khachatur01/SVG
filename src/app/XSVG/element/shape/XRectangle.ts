import {Size} from "../../model/Size";
import {XPolygon} from "../pointed/XPolygon";
import {Rect} from "../../model/Rect";

/*
*  0_____1
*  |     |
* 3|_____|2
* */

export class XRectangle extends XPolygon {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super([
      /* 0 */                                             /* 1 */
      {x: x, y: y},                          {x: width + x, y: y},
      {x: width + x, y: height + y},        {x: x, y: height + y}
      /* 2 */                                             /* 3 */

    ]);

    this.position = {x: x, y: y};
    this.setSize({
      x: x, y: y,
      width: width, height: height
    });

    this.setOverEvent();
    this.setDefaultStyle();
  }

  override get size(): Size {
    return super.size;
  }
  override setSize(rect: Rect) {
    let points = this.points;

    points[1].x = points[2].x = rect.x + rect.width;
    points[3].y = points[2].y = rect.y + rect.height;

    this.points = points;
    this._size = rect;
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }

}
