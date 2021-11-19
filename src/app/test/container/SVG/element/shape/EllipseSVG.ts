import {ShapeSVG} from "./ShapeSVG";
import {ElementSVG} from "../ElementSVG";
import {Position} from "../../SVG";

export class EllipseSVG extends ShapeSVG {
  private readonly svgElement: SVGEllipseElement;

  constructor(rx: number, ry: number, x: number, y: number) {
    super();
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "ellipse");
    this.setDefaultStyle();

    this.setAttr({
      x: x,
      y: y,
      rx: rx,
      ry: ry
    });

  }

  get SVG(): SVGEllipseElement {
    return this.svgElement as SVGEllipseElement;
  }

  get position(): Position {
    return {
      x: parseInt(this.getAttr("cx")),
      y: parseInt(this.getAttr("cy"))
    };
  }
  set position(position: Position) {
    this.setAttr({
      cx: position.x,
      cy: position.y,
    });

    if(this.boundingBox) {
      let bBox: DOMRect = this.SVG.getBBox();
      this.boundingBox.position = {x: bBox.x, y: bBox.y} as Position;
    }
  }

}
