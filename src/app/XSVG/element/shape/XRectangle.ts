import {XElement} from "../XElement";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";
import {XResizeable} from "../../service/edit/resize/XResizeable";
import {Size} from "../../model/Size";

export class XRectangle extends XElement {
  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "rect");
    this.setAttr({
      x: 0,
      y: 0
    });
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

}
