import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XEllipse extends XElement implements XDraggable {
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

    let bBox:DOMRect =  this.svgElement.getBoundingClientRect();
    this.xBoundingBox = new XBoundingBox(bBox.x, bBox.y, bBox.width, bBox.height);
  }

  get position(): Point {
    return {
      x: parseInt(this.getAttr("cx")),
      y: parseInt(this.getAttr("cy"))
    };
  }
  set position(position: Point) {
    this.setAttr({
      cx: position.x,
      cy: position.y
    });
  }
}
