import {XDraggable} from "../service/drag/XDraggable";
import {Point} from "../model/Point";
import {ParserError} from "@angular/compiler";
import {XBoundingBox} from "../service/edit/bound/XBoundingBox";

export abstract class XElement implements XDraggable {
  private xBoundingBox: XBoundingBox | null = null; // grip - resizer
  protected static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  abstract get position(): Point;
  abstract set position(position: Point);
  abstract get SVG(): SVGElement;

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
  remove() {
    this.SVG.parentElement?.removeChild(this.SVG);
  }

  focusStyle() {
    console.log("focus")
  }
  blurStyle() {
    console.log("blur")
  }

  setOverEvent() {
    this.SVG.addEventListener("mouseover", () => {
      this.setAttr({
        stroke: "red",
        "stroke-width": 3
      });
    })
    this.SVG.addEventListener("mouseleave", () => {
      this.setAttr({
        stroke: "black",
        "stroke-width": 2
      });
    })
  }
}

