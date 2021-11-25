import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XRectangle extends XElement {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "rect");
    this.setAttr({
      x: x,
      y: y,
      width: width,
      height: height
    });
    this.setOverEvent();
    this.setDefaultStyle();
  }

}
