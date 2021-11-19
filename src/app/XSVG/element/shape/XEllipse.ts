import {Point} from "../../model/Point";
import {XElement} from "../XElement";
import {XDraggable} from "../../service/drag/XDraggable";

export class XEllipse extends XElement implements XDraggable {
  private readonly svgElement: SVGEllipseElement;

  constructor(cx: number = 0, cy: number = 0, rx: number = 0, ry: number = 0) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "ellipse");
    this.setAttr({
      cx: cx,
      cy: cy,
      rx: rx,
      ry: ry,
      fill: "none",
      stroke: "black",
      "stroke-width": 2
    });
    this.setOverEvent();
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

  get SVG(): SVGElement {
    return this.svgElement;
  }
}
