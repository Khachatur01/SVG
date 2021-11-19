import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";

export class XRectangle extends XElement implements XDraggable {
  private readonly svgElement: SVGRectElement;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "rect");
    this.setAttr({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: "none",
      stroke: "black",
      "stroke-width": 2
    });
    this.setOverEvent();
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

  get SVG(): SVGElement {
    return this.svgElement;
  }
}
