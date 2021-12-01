import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";
import {XResizeable} from "../../service/edit/resize/XResizeable";
import {Size} from "../../model/Size";
import {XShape} from "../type/XShape";
import {Rect} from "../../model/Rect";
import {Point} from "../../model/Point";

export class XRectangle extends XShape {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "rect");
    this.position = {x: x, y: y};
    this.size = {width: width, height: height};

    this.setOverEvent();
    this.setDefaultStyle();
  }

  get size(): Size {
    return {
      width: parseInt(this.getAttr("width")),
      height: parseInt(this.getAttr("height"))
    };
  }
  set size(size: Size) {
    this.setAttr({
      width: size.width,
      height: size.height
    });
  }
  get position(): Point {
    return {
      x: parseFloat(this.getAttr("x")),
      y: parseFloat(this.getAttr("y"))
    };
  }

  set position(position: Point) {
    this.setAttr({
      x: position.x + this._lastDragPos.x,
      y: position.y + this._lastDragPos.y
    });
  }

  isComplete(): boolean {
    return this.getAttr("width") != "0" && this.getAttr("height") != "0";
  }
}
