import {XElement} from "../../../element/XElement";
import {ParserError} from "@angular/compiler";
import {Point} from "../../../model/Point";

export class XBoundingBox {
  private readonly box: SVGRectElement;

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    this.box = document.createElementNS(XElement.svgURI, "rect");
    this.setAttr({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: "none",
      stroke: "#113CFC",
      strokeWidth: "1",
      "stroke-dasharray": "3 3"
    });

    this.box.style.pointerEvents = "none";
  }

  get position(): Point {
    let x: string | null = this.box.getAttribute("x");
    let y: string | null = this.box.getAttribute("y");
    if(!x || !y) {
      x = "0";
      y = "0";
    }
    return {
      x: parseInt(x),
      y: parseInt(y)
    }
  }
  set position(point: Point) {
    this.box.setAttribute("x", point.x + "");
    this.box.setAttribute("y", point.y + "");
  }
  get SVG(): SVGElement {
    return this.box;
  }
  remove(): void {
    this.box.parentElement?.removeChild(this.box);
  }

  getAttr(attribute: string): string {
    let value = this.SVG.getAttribute(attribute)
    if(!value)
      throw ParserError;
    return value;
  }
  setAttr(attributes: object): void {
    for(const [key, value] of Object.entries(attributes))
      if(key && value)
        this.SVG.setAttribute(key, value as string);
  }
}
