import {XElement} from "../../../element/XElement";
import {ParserError} from "@angular/compiler";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";

export class XBoundingBox {
  private transform: Transform = new Transform();
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
      "stroke-width": 1,
      "stroke-dasharray": "3 3"
    });

    this.box.style.display = "none";
    this.box.style.pointerEvents = "none";
  }

  get position(): Point {
    return {
      x: this.transform.translateX,
      y: this.transform.translateY
    };
  }
  set position(position: Point) {
    this.transform.translateX = position.x;
    this.transform.translateY = position.y;
    this.box.style.transform = this.transform.toString();
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
