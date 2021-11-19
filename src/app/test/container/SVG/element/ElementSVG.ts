import {ParserError} from "@angular/compiler";
import {BoundingBoxSVG} from "./shape/BoundingBox/BoundingBoxSVG";
import {Position} from "../SVG";

export abstract class ElementSVG {
  protected boundingBox: BoundingBoxSVG | null = null;
  public static svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  abstract get SVG(): SVGElement;
  abstract get position(): Position;
  abstract set position(position: Position);

  setAttr(attributes: object): void {
    for(const [key, value] of Object.entries(attributes))
      if(key && value)
        this.SVG.setAttribute(key, value as string);

  }
  getAttr(attribute:string): string {
    let value = this.SVG.getAttribute(attribute)
    if(!value)
      throw ParserError;
    return value;
  }

  setDefaultStyle(): void {
    this.SVG.setAttribute("fill", "#bada55");
    this.SVG.setAttribute("stroke", "#000");
    this.SVG.setAttribute("strokeWidth", "2");
  }

  remove(): void {
    this.boundingBox?.SVG.parentElement?.removeChild(this.boundingBox?.SVG);
    this.SVG.parentElement?.removeChild(this.SVG);
  }
  focus(): void {
    let domRect = (this.SVG as SVGRectElement).getBBox();
    this.boundingBox = new BoundingBoxSVG(domRect.x, domRect.y, domRect.width, domRect.height);
    this.SVG.parentElement?.appendChild(this.boundingBox.SVG);
  }
  blur(): void {
    this.boundingBox?.SVG.parentElement?.removeChild(this.boundingBox?.SVG);
  }
}
