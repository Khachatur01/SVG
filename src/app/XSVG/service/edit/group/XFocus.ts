import {XElement} from "../../../element/XElement";
import {XDraggable} from "../../tool/drag/XDraggable";
import {Point} from "../../../model/Point";
import {XBoundingBox} from "./bound/XBoundingBox";
import {XSVG} from "../../../XSVG";
import {Rect} from "../../../model/Rect";
import {XResizeable} from "../resize/XResizeable";
import {Size} from "../../../model/Size";
import {XPath} from "../../../element/pointed/path/XPath";
import {XGroup} from "../../../element/group/XGroup";

export class XFocus implements XDraggable, XResizeable {
  private readonly _children: Set<XElement> = new Set<XElement>();
  private readonly container: XSVG;

  public readonly boundingBox: XBoundingBox;
  private readonly svgGroup: SVGGElement;
  private readonly svgElements: SVGGElement;
  private readonly svgBounding: SVGGElement;

  private _lastPosition: Point = {x: 0, y: 0};
  private _lastSize: Size = {width: 0, height: 0};
  private _lastAngle: number = 0;

  constructor(container: XSVG) {
    this.container = container;

    this.boundingBox = new XBoundingBox(this.container)
    this.svgGroup = document.createElementNS(XElement.svgURI, "g");
    this.svgGroup.id = "focus";
    this.svgElements = document.createElementNS(XElement.svgURI, "g");
    this.svgElements.id = "elements";
    this.svgBounding = this.boundingBox.svgGroup;

    this.svgGroup.appendChild(this.svgElements);
    this.svgGroup.appendChild(this.svgBounding);
    this.svgGroup.appendChild(this.boundingBox.refPointGroup);
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

    if(this._children.size == 1) {
      this.refPointView = Object.assign({}, xElement.refPoint);
      this.refPoint = Object.assign({}, xElement.refPoint);
      this._children.forEach((child: XElement) => {
        if(!(child instanceof XGroup))
          this.rotate(xElement.angle);
        else
          this.boundingBox.rotate(0);
      });

      this.container.style.setGlobalStyle(xElement.style.style);
    } else { /* more than one element */
      let elementRefPoint = Object.assign({}, xElement.refPoint);
      let refPoint = Object.assign({}, this.refPoint);
      xElement.refPoint = refPoint;
      xElement.correct(refPoint, elementRefPoint);

      this.container.style.recoverGlobalStyle();
    }
    this.fit();
    this.focus();
  }

  removeChild(xElement: XElement): void {
    this.container.elementsGroup.appendChild(xElement.SVG);
    this._children.delete(xElement);

    this.container.editTool.removeEditableElement();
    if (this._children.size == 0) {
      this.container.style.recoverGlobalStyle();
      this.blur();
    } else if(this._children.size == 1) {
      this.refPoint = Object.assign({}, xElement.refPoint);
      this.refPointView = Object.assign({}, xElement.refPoint);
      this.rotate(xElement.angle);
      this.focus();
      /* one element */
      this._children.forEach((child: XElement) => {
        this.container.style.setGlobalStyle(child.style.style);
        this.rotate(child.angle);
      });
    } else {
      this.focus();
    }

    this.fit();
    this.fixPosition();
  }

  clear() {
    let parent = this.container.elementsGroup;
    this._children.forEach((child: XElement) => parent?.appendChild(child.SVG));
    this._children.clear();
    this.blur();
    this.container.style.recoverGlobalStyle();
  }

  remove() {
    this.svgElements.innerHTML = "";
    this._children.forEach((child: XElement) => this.container.remove(child));

    this._children.clear();
    this.blur();
  }

  group(): void {
    let group = new XGroup(this.container);
    this._children.forEach((element: XElement) => {
      group.addElement(element);
      this.container.elements.delete(element);
      element.group = group;
    });

    this._children.clear();
    this.container.add(group);

    this.svgElements.appendChild(group.SVG);
    this._children.add(group);

    let lastRefPoint = this.refPoint;
    let refPoint = Object.assign({}, group.center);
    this.refPoint = refPoint;
    this.refPointView = refPoint;
    group.correct(refPoint, lastRefPoint);

    this.fit();
    this.boundingBox.rotate(0);
    this.focus();
  }

  get children(): Set<XElement> {
    return this._children;
  }

  get position(): Point {
    return this.boundingBox.position;
  }

  set position(delta: Point) {
    this._children.forEach((child: XElement) => child.position = delta);

    let refPoint = {
      x: this.lastRefPoint.x + delta.x,
      y: this.lastRefPoint.y + delta.y
    };
    this.refPoint = refPoint;
    this.refPointView = refPoint;

    this.boundingBox.correctByDelta(delta);
  }

  correct(point: Point): void {
    this._children.forEach((child: XElement) => child.correct(point, this.lastRefPoint));

    this.boundingBox.correct(point, this.lastRefPoint);
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
      this._children.forEach(child => child.setSize(rect));
    } else {
      /* TODO */
    }
    this.fit();
  }

  private calculateBoundingRect(rotated: boolean): Rect {
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

    let firstBoundingRect = rotated ? firstChild.rotatedBoundingRect : firstChild.boundingRect;

    minX = firstBoundingRect.x;
    minY = firstBoundingRect.y;
    maxX = firstBoundingRect.width + minX;
    maxY = firstBoundingRect.height + minY;

    for(let i = 1; i < children.length; i++) {
      let boundingRect = rotated ? children[i].rotatedBoundingRect : children[i].boundingRect;
      if(boundingRect.x < minX)
        minX = boundingRect.x;
      if(boundingRect.y < minY)
        minY = boundingRect.y;
      if(boundingRect.width + boundingRect.x > maxX)
        maxX = boundingRect.width + boundingRect.x;
      if(boundingRect.height + boundingRect.y > maxY)
        maxY = boundingRect.height + boundingRect.y;
    }

    this.boundingBox.boundingRect = {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };

    return this.boundingBox.boundingRect;
  }

  get boundingRect(): Rect {
    return this.calculateBoundingRect(false);
  }
  get rotatedBoundingRect(): Rect {
    return this.calculateBoundingRect(true);
  }

  set lastRefPoint(point: Point) {
    this.boundingBox.lastRefPoint = point;
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
    this.boundingBox.fixPosition();
  }
  fixRefPoint(): void {
    this.boundingBox.fixRefPoint();
  }
  fixPosition(): void {
    this._lastPosition = this.position;
    this._children.forEach(child => child.fixPosition());
    this.boundingBox.fixRefPoint();
    this.boundingBox.fixPosition();
  }
  fixSize(): void {
    this._lastSize = this.size;
  }
  set lastAngle(angle: number) {
    this._lastAngle = angle;
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
  }
  set refPointView(point: Point) {
    this.boundingBox.refPointView = point;
  }

  get angle(): number {
    return this.boundingBox.angle;
  }
  rotate(angle: number) {
    if(this._children.size == 1)
      this._children.forEach(child => child.rotate(angle));
    else
      this._children.forEach(child =>
        child.rotate((angle + child.lastAngle - this._lastAngle) % 360));
    this.boundingBox.rotate(angle);
  }

  fit(): void {
    if(this._children.size != 1) {
      this.fitRotated();
      this.boundingBox.rotate(0);
      return;
    }

    let contentRect: Rect = this.boundingRect;

    this.boundingBox.position = contentRect;
    this.boundingBox.setSize(contentRect);
    this.boundingBox.positionGrips();
  }

  fitRotated(): void {
    let contentRect: Rect = this.rotatedBoundingRect;

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

  toPath() {
    if(this._children.size == 0) return;
    let refPoint = Object.assign({}, this.refPoint);

    let path = new XPath(this.container);
    this._children.forEach((child: XElement) => {
      path.add(child.toPath());
    });
    this.remove();

    this.container.add(path);
    this.container.focus(path);

    this.refPointView = refPoint;
    this.refPoint = refPoint;
  }
}
