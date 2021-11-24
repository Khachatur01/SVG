import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

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
    let bBox:DOMRect =  this.svgElement.getBoundingClientRect();
    this.xBoundingBox = new XBoundingBox(bBox.x, bBox.y, bBox.width, bBox.height);
  }
}
