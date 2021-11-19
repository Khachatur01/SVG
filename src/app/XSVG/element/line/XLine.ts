import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";

export class XLine extends XElement implements XDraggable {
  private readonly svgElement: SVGLineElement;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "line");
    this.setAttr({
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      fill: "none",
      stroke: "black",
      "stroke-width": 2
    });
    this.setOverEvent();
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
  get SVG(): SVGElement {
    return this.svgElement;
  }

}
