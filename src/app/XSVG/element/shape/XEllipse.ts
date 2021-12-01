import {XElement} from "../XElement";
import {Size} from "../../model/Size";
import {Point} from "../../model/Point";
import {XShape} from "../type/XShape";

export class XEllipse extends XShape {
  constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");

    this.setAttr({
      cx: rx,
      cy: ry
    });

    this.position = {x: cx, y: cy};
    this.size = {width: rx, height: ry};

    this.setOverEvent();
    this.setDefaultStyle();
  }

  get position(): Point {
    let size = this.size;

    return {
      x: parseFloat(this.getAttr("cx")) - size.width / 2,
      y: parseFloat(this.getAttr("cy")) - size.height / 2
    };
  }

  set position(position: Point) {
    let size = this.size;
    this.setAttr({
      cx: size.width / 2 + position.x + this._lastDragPos.x,
      cy: size.height / 2 + position.y + this._lastDragPos.y
    });
  }

  get size(): Size {
    return {
      width: parseFloat(this.getAttr("rx")) * 2,
      height: parseFloat(this.getAttr("ry")) * 2
    };
  }
  set size(size: Size) {
    this.setAttr({
      rx: size.width,
      ry: size.height
    });
  }


  isComplete(): boolean {
    return this.getAttr("rx") != "0" && this.getAttr("ry") != "0";
  }
}
