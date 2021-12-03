import {Size} from "../../model/Size";
import {XPath} from "../path/XPath";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {Arc} from "../../model/path/curve/arc/Arc";
import {Point} from "../../model/Point";
import {LineTo} from "../../model/path/line/LineTo";

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
    position.x += this._lastDragPos.x;
    position.y += this._lastDragPos.y;
    let size = this.size;

    this.makeEllipse(position.x, position.y, size.width / 2, size.height / 2);
  }

  override get size(): Size {
    return super.size;
  }
  override set size(size: Size) {
    let position = this.position;

    this.makeEllipse(position.x, position.y, size.width / 2, size.height / 2);
  }

  makeEllipse(x: number, y: number, rx: number, ry: number): void {
    let path: Path = new Path();

    path.add(new MoveTo({x: x, y: ry + y}));
    path.add(new Arc(rx, ry, 0, 0, 1, {x: rx + x,   y: y       }));
    path.add(new Arc(rx, ry, 0, 0, 1, {x: rx*2 + x, y: ry + y  }));
    path.add(new Arc(rx, ry, 0, 0, 1, {x: rx + x,   y: ry*2 + y}));
    path.add(new Arc(rx, ry, 0, 0, 1, {x: x,        y: ry + y  }));

    this.path = path;
    this.setAttr({
      d: path.toString()
    })
  }
}
