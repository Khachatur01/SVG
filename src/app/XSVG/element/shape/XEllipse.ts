import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";
import {XResizeable} from "../../service/edit/resize/XResizeable";
import {Size} from "../../model/Size";
import {Point} from "../../model/Point";

export class XEllipse extends XElement {
  constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");

    this.position = {x: cx + rx, y: cy + ry};
    this.size = {width: rx, height: ry};

    this.setOverEvent();
    this.setDefaultStyle();
  }

  get size(): Size {
    return {
      width: parseFloat(this.getAttr("rx")),
      height: parseFloat(this.getAttr("ry"))
    };
  }
  set size(size: Size) {
    this.setAttr({
      rx: size.width,
      ry: size.height
    });
  }
}
