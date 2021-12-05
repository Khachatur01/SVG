import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../drag/XDraggable";
import {Point} from "../../../model/Point";
import {XBoundingBox} from "./bound/XBoundingBox";
import {XSVG} from "../../../XSVG";
import {Rect} from "../../../model/Rect";

export class XFocus implements XDraggable {
  private readonly _children: Set<XElement> = new Set<XElement>();
  private readonly container: XSVG;

  private readonly xBoundingBox: XBoundingBox = new XBoundingBox();
  private readonly svgGroup: SVGGElement;
  private readonly svgElements: SVGGElement;

  private _lastPosition: Point = {x: 0, y: 0};

  constructor(container: XSVG) {
    this.container = container;
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
    this.svgElements = document.createElementNS(XElement.svgURI, "g");

    this.svgGroup.appendChild(this.svgElements);
    this.svgGroup.appendChild(this.xBoundingBox.SVG);

    for(let grip of this.xBoundingBox.grips) {
      this.svgGroup.appendChild(grip.SVG);
    }

  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }
  get boundingSVG(): SVGElement {
    return this.xBoundingBox.SVG;
  }

  appendChild(xElement: XElement): void {
    this.svgElements.appendChild(xElement.SVG);
    this._children.add(xElement);
    this.fit();
    this.focus();
    this.fixPosition();

  }

  removeChild(xElement: XElement): void {
    this.svgGroup.parentElement?.appendChild(xElement.SVG);
    this._children.delete(xElement);
    this.fit();

    if(this._children.size == 0)
      this.blur();
    else
      this.focus();
    this.fixPosition();
  }

  clear() {
    let parent = this.svgGroup.parentElement;
    this._children.forEach((child: XElement) => {
      parent?.appendChild(child.SVG);
    });
    this._children.clear();
    this.blur();
  }

  remove() {
    this.svgElements.innerHTML = "";
    this._children.clear();
    this.blur();
  }

  get children(): Set<XElement> {
    return this._children;
  }

  get position(): Point {
    return this.xBoundingBox.position;
  }
  set position(position: Point) {
    this.xBoundingBox.position = position;

    this._children.forEach((child: XElement) => {
      child.position = {
        x: position.x - this._lastPosition.x,
        y: position.y - this._lastPosition.y
      };
    });
    this.fit();
  }

  fixPosition(): void {
    this._lastPosition = this.position;
  }

  hasChild(xElement: XElement): boolean {
    return this._children.has(xElement);
  }

  fit(): void {
    let contentRect: Rect = this.boundingRect;

    this.xBoundingBox.size = contentRect;
    this.xBoundingBox.position = contentRect;
    this.xBoundingBox.gripsPosition();
  }

  focus() {
    if(this._children.size > 1)
      this.xBoundingBox.multipleFocus();
    else
      this.xBoundingBox.singleFocus();
  }
  blur() {
    this.xBoundingBox.blur();
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
  get boundingRect(): Rect {
    let minX, minY;
    let maxX, maxY;

    let children = Array.from(this._children);
    if(children.length < 1)
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

    let firstChild = children[0];
    let firstChildPos = firstChild.position;
    let firstChildSize = firstChild.size;
    minX = firstChildPos.x;
    minY = firstChildPos.y;
    maxX = firstChildSize.width + minX;
    maxY = firstChildSize.height + minY;

    for(let i = 1; i < children.length; i++) {
      let childPos = children[i].position;
      let childSize = children[i].size;
      if(childPos.x < minX)
        minX = childPos.x;
      if(childPos.y < minY)
        minY = childPos.y;
      if(childSize.width + childPos.x > maxX)
        maxX = childSize.width + childPos.x;
      if(childSize.height + childPos.y > maxY)
        maxY = childSize.height + childPos.y;
    }

    this.xBoundingBox.boundingRect = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    return this.xBoundingBox.boundingRect;
  }
}
