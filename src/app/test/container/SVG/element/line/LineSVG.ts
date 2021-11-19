import {ShapeSVG} from "../shape/ShapeSVG";
import {Position} from "../../SVG";
import {ElementSVG} from "../ElementSVG";

export class LineSVG extends ShapeSVG {
  private readonly svgElement: SVGLineElement;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "line");
    this.setDefaultStyle();
    this.setAttr({
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      fill: "none"
    });
  }

  get SVG(): SVGLineElement {
    return this.svgElement as SVGLineElement;
  }

  get position(): Position {
    return {
      x: parseInt(this.getAttr("x1")),
      y: parseInt(this.getAttr("y1"))
    }
  }
  set position(position: Position) {
    let x2: number = parseInt(this.getAttr("x2")) + position.x - parseInt(this.getAttr("x1"));
    let y2: number = parseInt(this.getAttr("y2")) + position.y - parseInt(this.getAttr("y1"));
    this.setAttr({
      x1: position.x,
      y1: position.y,
      x2: x2,
      y2: y2
    });
    if(this.boundingBox) {
      let bBox: DOMRect = this.SVG.getBBox();
      this.boundingBox.position = {x: bBox.x, y: bBox.y} as Position;
    }

  }
}
