import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../tool/drag/XDraggable";
import {Point} from "../../../model/Point";
import {XBoundingBox} from "./bound/XBoundingBox";
import {XSVG} from "../../../XSVG";
import {Rect} from "../../../model/Rect";
import {XResizeable} from "../resize/XResizeable";
import {Size} from "../../../model/Size";

export class XFocus implements XDraggable, XResizeable {
  private readonly _children: Set<XElement> = new Set<XElement>();
  private readonly container: XSVG;

  public readonly boundingBox: XBoundingBox;
  private readonly svgGroup: SVGGElement;
  private readonly svgElements: SVGGElement;

  private _lastPosition: Point = {x: 0, y: 0};
  private _lastSize: Size = {width: 0, height: 0};

  constructor(container: XSVG) {
    this.container = container;

    this.boundingBox = new XBoundingBox(this.container)
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
    this.svgElements = document.createElementNS(XElement.svgURI, "g");

    this.svgGroup.appendChild(this.svgElements);
    this.svgGroup.appendChild(this.boundingBox.SVG);

    for(let grip of this.boundingBox.grips) {
      this.svgGroup.appendChild(grip.SVG);
    }

  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }
  get boundingSVG(): SVGElement {
    return this.boundingBox.SVG;
  }

  appendChild(xElement: XElement): void {
    this.svgElements.appendChild(xElement.SVG);
    this._children.add(xElement);
    this.fit();
    this.focus();
    this.fixPosition();
  }

  removeChild(xElement: XElement): void {
    this.container.elementsGroup.appendChild(xElement.SVG);
    this._children.delete(xElement);
    this.fit();

    if(this._children.size == 0)
      this.blur();
    else
      this.focus();
    this.fixPosition();
  }

  clear() {
    let parent = this.container.elementsGroup;
    this._children.forEach((child: XElement) => {
      parent?.appendChild(child.SVG);
    });
    this._children.clear();
    this.blur();
  }

  remove() {
    this.svgElements.innerHTML = "";
    for(let child of this._children)
      this.container.remove(child);

    this._children.clear();
    this.blur();
  }

  get children(): Set<XElement> {
    return this._children;
  }

  get position(): Point {
    return this.boundingBox.position;
  }
  set position(position: Point) {
    this.boundingBox.position = position;

    this._children.forEach((child: XElement) => {
      child.position = {
        x: position.x - this._lastPosition.x,
        y: position.y - this._lastPosition.y
      };
    });
    this.fit();
  }

  get size(): Size {
    return this.boundingRect;
  }
  setSize(rect: Rect): void {
    if(this._children.size == 1)
      this._children.forEach(child => {child.setSize(rect)});
    else
      /* FIXME */
      for(let child of this._children)
        child.setSize(rect);
    this.fit()
  }

  fixRect(): void {
    this._lastPosition = this.position;
    this._lastSize = this.size;
    for(let child of this._children)
      child.fixRect();

  }
  fixPosition(): void {
    this._lastPosition = this.position;
  }
  fixSize(): void {
    this._lastSize = this.size;
  }

  hasChild(xElement: XElement): boolean {
    return this._children.has(xElement);
  }

  rotate(refPoint: Point, angle: number) {
    for(let child of this._children) {
      child.rotate(refPoint, angle);
    }
  }

  fit(): void {
    let contentRect: Rect = this.boundingRect;

    this.boundingBox.position = contentRect;
    this.boundingBox.setSize(contentRect);
    this.boundingBox.gripsPosition();
  }

  focus() {
    if(this._children.size > 1)
      this.boundingBox.multipleFocus();
    else
      this.boundingBox.singleFocus();
  }
  blur() {
    this.boundingBox.blur();
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

    this.boundingBox.boundingRect = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    return this.boundingBox.boundingRect;
  }

  get lastRect(): Rect {
    return {
      x: this._lastPosition.x,
      y: this._lastPosition.y,
      width: this._lastSize.width,
      height: this._lastSize.height,
    };
  }

}
