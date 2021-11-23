import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XLine extends XElement implements XDraggable {
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

  get position(): Point {
    return {
      x: parseInt(this.getAttr("x1")),
      y: parseInt(this.getAttr("y1"))
    };
  }
  set position(position: Point) {
    let x2: number = parseInt(this.getAttr("x2")) + position.x - parseInt(this.getAttr("x1"));
    let y2: number = parseInt(this.getAttr("y2")) + position.y - parseInt(this.getAttr("y1"));
    this.setAttr({
      x1: position.x,
      y1: position.y,
      x2: x2,
      y2: y2
    });
  }
}
