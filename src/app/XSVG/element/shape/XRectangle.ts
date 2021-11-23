import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XRectangle extends XElement implements XDraggable {
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
    let bBox:DOMRect =  this.svgElement.getBoundingClientRect();
    this.xBoundingBox = new XBoundingBox(bBox.x, bBox.y, bBox.width, bBox.height);
  }

  get position(): Point {
    return {
      x: parseInt(this.getAttr("x")),
      y: parseInt(this.getAttr("y"))
    };
  }
  set position(position: Point) {
    this.setAttr({
      x: position.x,
      y: position.y
    });
  }
}
