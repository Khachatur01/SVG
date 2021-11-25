import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";
import {XBoundingBox} from "../bound/XBoundingBox";
import {XSVG} from "../../../XSVG";

export class XGroup implements XDraggable {
  private transform: Transform = new Transform();
  private _children: XElement[] = [];
  private container: XSVG;

  protected xBoundingBox: XBoundingBox = new XBoundingBox(); // grip - resizer
  protected svgGroup: SVGGElement;
  protected svgElements: SVGGElement;

  constructor(container: XSVG) {
    this.container = container;
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
    this.svgElements = document.createElementNS(XElement.svgURI, "g");

    this.svgGroup.appendChild(this.xBoundingBox.SVG);
    this.svgGroup.appendChild(this.svgElements);
  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }
  set SVG(svgGElement: SVGGElement) {
    this.svgGroup = svgGElement
  }

  appendChild(xElement: XElement): void {
    this.svgElements.appendChild(xElement.SVG);
    this._children.push(xElement);
    this.fit();
  }

  removeChild(xElement: XElement): void {
    this.svgGroup.parentElement?.appendChild(xElement.SVG);
    this._children.splice(this._children.lastIndexOf(xElement), 1);
    this.fit();
  }



  clear() {
    let parent = this.svgGroup.parentElement;
    let children: Element[] = Array.from(this.svgElements.children);
    children.forEach((child: Element) => {
      parent?.appendChild(child);
    });
    this.svgElements.innerHTML = "";
    this._children = [];
  }

  remove() {
    this.svgGroup.remove();
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
    this._children.forEach((child: XElement) => {
      child.position = position;
    });

    this.xBoundingBox.position = position
  }

  fit(): void {
    let containerRect: DOMRect = this.container.HTML.getBoundingClientRect();
    let contentRect: DOMRect = this.svgElements.getBoundingClientRect();

    this.xBoundingBox.setAttr({
      x: contentRect.x - containerRect.x,
      y: contentRect.y - containerRect.y,
      width: contentRect.width,
      height: contentRect.height
    });

    this.xBoundingBox.position = {
      x: this.transform.translateX,
      y: this.transform.translateY
    };
  }

  focusStyle() {
    this.xBoundingBox.SVG.style.display = "block";
  }
  blurStyle() {
    this.xBoundingBox.SVG.style.display = "none";
  }

  highlight() {

  }

  lowlight() {

  }
}
