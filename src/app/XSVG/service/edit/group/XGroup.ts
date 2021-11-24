import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";

export class XGroup implements XDraggable {
  private transform: Transform = new Transform();
  private svgElement: SVGGElement;

  constructor() {
    this.svgElement = document.createElementNS(XElement.svgURI, "g");
  }

  get SVG(): SVGGElement {
    return this.svgElement;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgElement = svgGElement
  }

  appendChild(svgElement: SVGElement): void {
    this.svgElement.appendChild(svgElement);
  }

  removeChild(svgElement: SVGElement): void {
    this.svgElement.removeChild(svgElement);
  }

  clear() {
    this.svgElement.innerHTML = "";
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
    console.log(this.transform.toString())
    this.svgElement.style.transform = this.transform.toString();
  }
}
