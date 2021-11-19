import {ShapeSVG} from "./ShapeSVG";
import {Position} from "../../SVG";
import {ElementSVG} from "../ElementSVG";

export class RectangleSVG extends ShapeSVG {
  private readonly svgElement: SVGRectElement;

  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "rect");
    this.setDefaultStyle();

    this.setAttr({
      x: x,
      y: y,
      width: width,
      height: height
    });
  }

  get SVG(): SVGRectElement {
    return this.svgElement as SVGRectElement;
  }
  get position(): Position {
    return {
      x: parseInt(this.getAttr("x")),
      y: parseInt(this.getAttr("y"))
    }
  }
  set position(position: Position) {
    this.setAttr({
      x: position.x,
      y: position.y,
    });

    if(this.boundingBox) {
      let bBox: DOMRect = this.SVG.getBBox();
      this.boundingBox.position = {x: bBox.x, y: bBox.y} as Position;
    }
  }
}
