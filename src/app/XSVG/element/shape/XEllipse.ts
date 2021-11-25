import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XEllipse extends XElement {
  constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");
    this.setAttr({
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry
    });
    this.setOverEvent();
    this.setDefaultStyle();
  }
}
