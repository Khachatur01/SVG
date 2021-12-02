// import {XElement} from "../XElement";
// import {Size} from "../../model/Size";
// import {Point} from "../../model/Point";
// import {XShape} from "../type/XShape";
//
// export class XEllipse extends XShape {
//   constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
//     super();
//     this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");
//
//     this.setAttr({
//       cx: rx,
//       cy: ry
//     });
//
//     this.position = {x: cx, y: cy};
//     this.size = {width: rx, height: ry};
//
//     this.setOverEvent();
//     this.setDefaultStyle();
//   }
//
//   get position(): Point {
//     let size = this.size;
//
//     return {
//       x: parseFloat(this.getAttr("cx")) - size.width / 2,
//       y: parseFloat(this.getAttr("cy")) - size.height / 2
//     };
//   }
//
//   set position(position: Point) {
//     let size = this.size;
//     this.setAttr({
//       cx: size.width / 2 + position.x + this._lastDragPos.x,
//       cy: size.height / 2 + position.y + this._lastDragPos.y
//     });
//   }
//
//   get size(): Size {
//     return {
//       width: parseFloat(this.getAttr("rx")) * 2,
//       height: parseFloat(this.getAttr("ry")) * 2
//     };
//   }
//   set size(size: Size) {
//     this.setAttr({
//       rx: size.width,
//       ry: size.height
//     });
//   }
//
//
//   isComplete(): boolean {
//     return this.getAttr("rx") != "0" && this.getAttr("ry") != "0";
//   }
// }

import {Size} from "../../model/Size";
import {XPath} from "../path/XPath";
import {Path} from "../../model/path/Path";
import {MoveTo} from "../../model/path/point/MoveTo";
import {Arc} from "../../model/path/curve/arc/Arc";
import {Point} from "../../model/Point";

export class XEllipse extends XPath {
  constructor(x: number = 0, y: number = 0, rx: number = 100, ry: number = 50) {
    super();
    this.makeEllipse(x, y, rx, ry);

    this.position = {x: x, y: y};
    this.size = {width: rx, height: ry};

    this.setOverEvent();
    this.setDefaultStyle();
  }

  override get position(): Point {
    return super.position;
  }
  override set position(position: Point) {
    this.makeEllipse(position.x + this._lastDragPos.x, position.y + this._lastDragPos.y, this.size.width / 2, this.size.height / 2);
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
