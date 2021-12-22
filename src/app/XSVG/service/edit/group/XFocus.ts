import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../tool/drag/XDraggable";
import {Point} from "../../../model/Point";
import {XBoundingBox} from "./bound/XBoundingBox";
import {XSVG} from "../../../XSVG";
import {Rect} from "../../../model/Rect";
import {XResizeable} from "../resize/XResizeable";
import {Size} from "../../../model/Size";
import {Matrix} from "../../math/Matrix";

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
    this.svgGroup.appendChild(this.boundingBox.refPointSVG);
    this.svgGroup.appendChild(this.boundingBox.rotPointSVG);
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

    if(this._children.size == 1) {
      this.refPoint = xElement.refPoint;
      this.refPointView = xElement.refPoint;
      this.rotate(xElement.angle);
    } else {
      this.fixRect();
      this.refPoint = this.center;
      this.refPointView = this.center;
    }
  }

  removeChild(xElement: XElement): void {
    this.container.elementsGroup.appendChild(xElement.SVG);
    this._children.delete(xElement);
    this.fit();

    if (this._children.size == 0) {
      this.blur();
    } else {
      this.fixRect();
      this.focus();
      this.refPoint = this.center;
      this.refPointView = this.center;
    }
    this.fixPosition();
  }

  clear() {
    let parent = this.container.elementsGroup;
    this._children.forEach((child: XElement) => parent?.appendChild(child.SVG));
    this._children.clear();
    this.blur();
    this.rotate(0);
  }

  remove() {
    this.svgElements.innerHTML = "";
    this._children.forEach((child: XElement) => this.container.remove(child));

    this._children.clear();
    this.blur();
  }

  get children(): Set<XElement> {
    return this._children;
  }

  get position(): Point {
    return this.boundingBox.position;
  }

  correct(delta: Point): void {
    let bboxPosition = this.boundingBox.position;
    this.boundingBox.position = {
      x: bboxPosition.x + delta.x,
      y: bboxPosition.y + delta.y
    };

    this._children.forEach((child: XElement) => {
      child.position = delta;
    });
    this.fit();
  }

  set position(position: Point) {
    this.boundingBox.position = position;

    this._children.forEach((child: XElement) => {
      child.position = {
        x: position.x - this._lastPosition.x,
        y: position.y - this._lastPosition.y
      };
    });

    let refPoint = {
      x: this.boundingBox.lastRefPoint.x + position.x - this._lastPosition.x,
      y: this.boundingBox.lastRefPoint.y + position.y - this._lastPosition.y
    };
    this.refPoint = refPoint;
    this.refPointView = refPoint;
    this.fit();
  }

  getRefPointByRect(rect: Rect): Point {
    let dw = 1;
    let dh = 1;

    if(this._lastSize.width != 0)
      dw = rect.width / this._lastSize.width;
    if(this._lastSize.height != 0)
      dh = rect.height / this._lastSize.height;

    return  {
      x: rect.x + Math.abs(this.boundingBox.lastRefPoint.x - rect.x) * dw,
      y: rect.y + Math.abs(this.boundingBox.lastRefPoint.y - rect.y) * dh
    };
  }

  get center(): Point {
    return {
      x: this._lastPosition.x + this._lastSize.width / 2,
      y: this._lastPosition.y + this._lastSize.height / 2
    };
  }

  get size(): Size {
    return this.boundingRect;
  }
  setSize(rect: Rect): void {
    if (this._children.size == 1) {
      this._children.forEach(child => {
        child.setSize(rect);
        child.refPoint = this.refPoint;
      });
    } else {
      /* TODO */
    }
    this.fit()
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

  set lastRefPoint(refPoint: Point) {
    this.boundingBox.lastRefPoint = refPoint;
  }
  get lastRefPoint(): Point {
    return this.boundingBox.lastRefPoint;
  }
  get lastRect(): Rect {
    return {
      x: this._lastPosition.x,
      y: this._lastPosition.y,
      width: this._lastSize.width,
      height: this._lastSize.height,
    };
  }
  fixRect(): void {
    this._lastPosition = this.position;
    this._lastSize = this.size;
    this._children.forEach(child => child.fixRect());
    this.boundingBox.fixRefPoint();
  }
  fixPosition(): void {
    this._lastPosition = this.position;
    this.boundingBox.fixRefPoint();
  }
  fixSize(): void {
    this._lastSize = this.size;
    this.boundingBox.fixRefPoint();
  }

  hasChild(xElement: XElement): boolean {
    return this._children.has(xElement);
  }

  get refPoint(): Point {
    return this.boundingBox.refPoint;
  }
  set refPoint(point: Point) {
    this._children.forEach(child => child.refPoint = point);
    this.boundingBox.refPoint = point;

    let rotatedRefPoint = Matrix.rotate(
      [point],
      this.lastRefPoint,
      -this.angle
    )[0];


  }
  set refPointView(point: Point) {
    this.boundingBox.refPointView = point;
  }

  set refPointRefPoint(point: Point) {
    this.boundingBox.refPointRefPoint = point;
  }

  get angle(): number {
    return this.boundingBox.angle;
  }
  rotate(angle: number) {
    this._children.forEach(child => child.rotate(angle));
    this.boundingBox.rotate(angle);
  }

  fit(): void {
    let contentRect: Rect = this.boundingRect;

    this.boundingBox.position = contentRect;
    this.boundingBox.setSize(contentRect);
    this.boundingBox.positionGrips();
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
}
