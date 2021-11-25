import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";

export class XGroup implements XDraggable {
  private transform: Transform = new Transform();
  private svgGroup: SVGGElement;

  constructor() {
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgGroup = svgGElement
  }

  appendChild(svgElement: SVGElement): void {
    this.svgGroup.appendChild(svgElement);
  }

  removeChild(svgElement: SVGElement): void {
    this.svgGroup.removeChild(svgElement);
  }

  clear() {
    let parent = this.SVG.parentElement;
    let children: Element[] = Array.from(this.SVG.children);
    children.forEach((child: Element) => {
      parent?.appendChild(child);
    });
    this.SVG.innerHTML = "";
  }

  remove() {
    this.SVG.parentElement?.removeChild(this.SVG);
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
    this.svgGroup.style.transform = this.transform.toString();
  }
}
