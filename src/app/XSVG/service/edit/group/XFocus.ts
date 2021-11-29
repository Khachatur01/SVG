import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {Transform} from "../../../model/Transform";
import {XBoundingBox} from "../bound/XBoundingBox";
import {XSVG} from "../../../XSVG";

export class XFocus implements XDraggable {
  private readonly transform: Transform = new Transform();
  private readonly _children: Set<XElement> = new Set<XElement>();
  private readonly container: XSVG;

  private readonly xBoundingBox: XBoundingBox = new XBoundingBox(); // grip - resizer
  private readonly svgGroup: SVGGElement;
  private readonly svgElements: SVGGElement;

  private _lastDragPos: Point = {x: 0, y: 0}

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

  appendChild(xElement: XElement): void {
    this.svgElements.appendChild(xElement.SVG);
    this._children.add(xElement);
    this.fit();
    this.focusStyle();
  }

  removeChild(xElement: XElement): void {
    this.svgGroup.parentElement?.appendChild(xElement.SVG);
    this._children.delete(xElement);
    this.fit();
  }

  clear() {
    let parent = this.svgGroup.parentElement;
    this._children.forEach((child: XElement) => {
      parent?.appendChild(child.SVG);
    });
    this._children.clear();
    this.blurStyle();
  }

  remove() {
    this.svgElements.innerHTML = "";
    this._children.clear();
    this.blurStyle();
  }

  get children(): Set<XElement> {
    return this._children;
  }

  get position(): Point {
    return {
      x: this.transform.translateX,
      y: this.transform.translateY
    };
  }
  set position(position: Point) {
    this.xBoundingBox.position = {
      x: this.transform.translateX,
      y: this.transform.translateY
    };

    this._children.forEach((child: XElement) => {
      child.position = {
        x: this.transform.translateX - this._lastDragPos.x,
        y: this.transform.translateY - this._lastDragPos.y
      };
    });

    this.transform.translateX = position.x;
    this.transform.translateY = position.y;
  }
  fixPosition(): void {
    this._lastDragPos = this.position;
  }

  hasChild(xElement: XElement): boolean {
    return this._children.has(xElement);
  }

  fit(): void {
    let containerRect: DOMRect = this.container.HTML.getBoundingClientRect();
    let contentRect: DOMRect = this.svgElements.getBoundingClientRect();

    this.xBoundingBox.setAttr({
      width: contentRect.width,
      height: contentRect.height
    });

    this.xBoundingBox.position = {
      x: this.transform.translateX = contentRect.x - containerRect.x,
      y: this.transform.translateY = contentRect.y - containerRect.y
    };
  }

  focusStyle() {
    this.xBoundingBox.SVG.style.display = "block";
  }
  blurStyle() {
    this.xBoundingBox.SVG.style.display = "none";
  }

  highlight() {
    this._children.forEach((child: XElement) => {
      child.highlight();
    });
  }

  lowlight() {
    this._children.forEach((child: XElement) => {
      child.lowlight();
    });
  }
}
