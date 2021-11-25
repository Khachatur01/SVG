import {ParserError} from "@angular/compiler";
import {Point} from "../model/Point";
import {Transform} from "../model/Transform";

export abstract class XElement {
  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  private transform: Transform = new Transform();
  protected style: any = {
    fill: "none",
    stroke: "black",
    highlight: "red",
    strokeWidth: 2
  }

  protected svgElement: SVGElement = document.createElementNS(XElement.svgURI, "rect"); // default element

  get SVG(): SVGElement {
    return this.svgElement;
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
  setDefaultStyle(): void {
    this.setAttr({
      fill: this.style.fill,
      stroke: this.style.stroke,
      "stroke-width": this.style.strokeWidth
    });
  }

  remove() {
    this.svgElement.remove();
  }

  setOverEvent() {
    this.SVG.addEventListener("mouseover", () => {
      this.highlight();
    })
    this.SVG.addEventListener("mouseleave", () => {
      this.lowlight();
    })
  }

  highlight(): void {
    this.setAttr({
      stroke: this.style.highlight
    });
  }
  lowlight(): void {
    this.setAttr({
      stroke: this.style.stroke
    });
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
    this.svgElement.style.transform = this.transform.toString();
  }
}

