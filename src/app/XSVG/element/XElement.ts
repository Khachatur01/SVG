import {Point} from "../model/Point";
import {Size} from "../model/Size";
import {XResizeable} from "../service/edit/resize/XResizeable";

export abstract class XElement implements XResizeable {
  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  protected style: any = {
    fill: "none",
    stroke: "#24ff24",
    highlight: "red",
    strokeWidth: 10
  }
  protected _lastDragPos: Point = {x: 0, y: 0}

  protected svgElement: SVGElement = document.createElementNS(XElement.svgURI, "rect"); // default element

  abstract get size(): Size;
  abstract set size(size: Size);
  abstract isComplete(): boolean;
  abstract get position(): Point;
  abstract set position(position: Point);

  get SVG(): SVGElement {
    return this.svgElement;
  }

  getAttr(attribute: string): string {
    let value = this.SVG.getAttribute(attribute);
    if (!value)
      return "0";
    return value;
  }

  setAttr(attributes: object): void {
    for (const [key, value] of Object.entries(attributes))
      if (key && value)
        this.SVG.setAttribute(key, value + "");
  }

  setDefaultStyle(): void {
    this.setAttr({
      fill: this.style.fill,
      stroke: this.style.stroke,
      "stroke-width": this.style.strokeWidth
    });
  }

  setOverEvent() {
    this.SVG.addEventListener("mouseover", this.highlight);
    this.SVG.addEventListener("mouseout", this.lowlight);
  }
  removeOverEvent() {
    this.SVG.removeEventListener("mouseover", this.highlight);
    this.SVG.removeEventListener("mouseout", this.lowlight);
  }

  remove() {
    this.svgElement.remove();
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

  fixPosition(): void {
    this._lastDragPos = this.position;
  }
}


