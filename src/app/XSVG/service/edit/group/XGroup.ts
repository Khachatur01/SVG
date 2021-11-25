import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";

export class XGroup implements XDraggable {
  private transform: Transform = new Transform();
  private svgGroup: SVGGElement;
  private _children: XElement[] = [];

  constructor() {
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgGroup = svgGElement
  }

  appendChild(xElement: XElement): void {
    this.svgGroup.appendChild(xElement.SVG);
    this._children.push(xElement);
  }

  removeChild(xElement: XElement): void {
    this.SVG.parentElement?.appendChild(xElement.SVG);
    this.svgGroup.removeChild(xElement.SVG);

    this._children.splice(this._children.lastIndexOf(xElement), 1);
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

  get children(): XElement[] {
    return this._children;
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
