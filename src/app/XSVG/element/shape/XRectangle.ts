import {Size} from "../../model/Size";
import {XPolygon} from "../pointed/XPolygon";

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
    this.size = {width: width, height: height};

    this.setOverEvent();
    this.setDefaultStyle();
  }

  override get size(): Size {
    let points = this.points;
    return {
      width: points[1].x - points[0].x,
      height: points[3].y - points[0].y
    }
  }
  override set size(size: Size) {
    let points = this.points;

    points[1].x = points[2].x = points[3].x + size.width;
    points[3].y = points[2].y = points[1].y + size.height;

    this.points = points;
  }

  override isComplete(): boolean {
    let size = this.size;
    return size.width != 0 && size.height != 0;
  }
}
