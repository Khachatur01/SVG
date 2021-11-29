import {Point} from "../model/Point";
import {Transform} from "../model/Transform";
import {Size} from "../model/Size";
import {XResizeable} from "../service/edit/resize/XResizeable";

export abstract class XElement implements XResizeable {
  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  protected transform: Transform = new Transform();
  protected style: any = {
    fill: "none",
    stroke: "#24ff24",
    highlight: "red",
    strokeWidth: 5
  }
  private _lastDragPos: Point = {x: 0, y: 0}

  protected svgElement: SVGElement = document.createElementNS(XElement.svgURI, "rect"); // default element

  abstract get size(): Size;
  abstract set size(size: Size);

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
    this.SVG.addEventListener("mouseout", () => {
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
    this.transform.translateX = position.x + this._lastDragPos.x;
    this.transform.translateY = position.y + this._lastDragPos.y;
    this.svgElement.style.transform = this.transform.toString();
  }

  fixPosition(): void {
    this._lastDragPos = this.position;
  }
}


