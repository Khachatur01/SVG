import {Size} from "../../model/Size";
import {XPath} from "../path/XPath";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {Arc} from "../../model/path/curve/arc/Arc";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";

export class XEllipse extends XPath {
  constructor(x: number = 0, y: number = 0, rx: number = 0, ry: number = 0) {
    super();
    this.makeEllipse(x, y, rx, ry);

    this.setOverEvent();
    this.setDefaultStyle();
  }

  override get position(): Point {
    return super.position;
  }

  override set position(position: Point) {
    position.x += this._lastPosition.x;
    position.y += this._lastPosition.y;
    let size = this.size;

    this.makeEllipse(position.x, position.y, size.width / 2, size.height / 2);
  }

  override get size(): Size {
    return super.size;
  }
  override setSize(rect: Rect) {
    this.makeEllipse(rect.x, rect.y, rect.width / 2, rect.height / 2);
  }

  makeEllipse(x: number, y: number, rx: number, ry: number): void {
    let path: Path = new Path();

    /* calculate positive position and size if size is negative */
    if(rx < 0) {
      rx = -rx;
      x -= rx * 2;
    }
    if(ry < 0) {
      ry = -ry;
      y -= ry * 2;
    }

    let points: Point[] = [
      {x:        x,  y: ry +   y},
      {x: rx +   x,  y:        y},
      {x: rx*2 + x,  y: ry +   y},
      {x: rx +   x,  y: ry*2 + y},
      {x: x,         y: ry +   y}
    ];

    path.add(new MoveTo(points[0]));
    path.add(new Arc(rx, ry, 0, 0, 1, points[1]));
    path.add(new Arc(rx, ry, 0, 0, 1, points[2]));
    path.add(new Arc(rx, ry, 0, 0, 1, points[3]));
    path.add(new Arc(rx, ry, 0, 0, 1, points[4]));

    this.path = path;
    this.setAttr({
      d: path.toString()
    })
  }
}
