import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";
import {Size} from "../../model/Size";

export class XLine extends XElement {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "line");
    this.setAttr({
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2
    });
    this.setOverEvent();
    this.setDefaultStyle();
  }

  get size(): Size {
    return {width: 0, height: 0};
  }
  set size(size: Size) {
  }
}
