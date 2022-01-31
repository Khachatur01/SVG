import {ElementView} from "../../../element/ElementView";
import {Draggable} from "../../tool/drag/Draggable";
import {Point} from "../../../model/Point";
import {BoundingBox} from "./bound/BoundingBox";
import {SVG} from "../../../SVG";
import {Rect} from "../../../model/Rect";
import {Resizeable} from "../resize/Resizeable";
import {Size} from "../../../model/Size";
import {PathView} from "../../../element/shape/pointed/PathView";
import {GroupView} from "../../../element/group/GroupView";
import {Callback} from "../../../dataSource/Callback";
import {Matrix} from "../../math/Matrix";
import {ForeignObjectView} from "../../../element/foreign/ForeignObjectView";
import {first} from "rxjs";

export class Focus implements Draggable, Resizeable {
  private readonly _children: Set<ElementView> = new Set<ElementView>();
  private readonly container: SVG;

  public readonly boundingBox: BoundingBox;
  private readonly svgGroup: SVGGElement;
  private readonly svgBounding: SVGGElement;

  private _lastPosition: Point = {x: 0, y: 0};
  private _lastSize: Size = {width: 0, height: 0};
  private _lastAngle: number = 0;

  constructor(container: SVG) {
    this.container = container;

    this.boundingBox = new BoundingBox(this.container)
    this.svgGroup = document.createElementNS(ElementView.svgURI, "g");
    this.svgGroup.id = "focus";
    this.svgBounding = this.boundingBox.svgGroup;

    this.svgGroup.appendChild(this.svgBounding);
    this.svgGroup.appendChild(this.boundingBox.refPointGroup);
  }

  get SVG(): SVGGElement {
    return this.svgGroup;
  }

  get boundingSVG(): SVGElement {
    return this.boundingBox.SVG;
  }

  appendChild(xElement: ElementView, showBounding: boolean = true): void {
    this._children.add(xElement);

    if (this._children.size == 1) {
      this.refPointView = Object.assign({}, xElement.refPoint);
      this.refPoint = Object.assign({}, xElement.refPoint);
      this._children.forEach((child: ElementView) => {
        if (!(child instanceof GroupView)) {
          this.rotate(xElement.angle);
        } else
          this.boundingBox.rotate(0);
      });
      this.container.style.fixGlobalStyle();
      this.container.style.setGlobalStyle(xElement.style);
    } else { /* more than one element */
      let elementRefPoint = Object.assign({}, xElement.refPoint);
      let refPoint = Object.assign({}, this.refPoint);
      xElement.refPoint = refPoint;
      xElement.correct(refPoint, elementRefPoint);
      this.container.style.recoverGlobalStyle();
    }
    this.fit();
    if(showBounding)
      this.focus(xElement.rotatable);
  }

  removeChild(xElement: ElementView): void {
    this._children.delete(xElement);

    this.container.editTool.removeEditableElement();
    if (this._children.size == 0) {
      /* no element */
      this.container.style.recoverGlobalStyle();
      this.blur();
    } else if (this._children.size == 1) {
      /* one element */
      this.container.style.fixGlobalStyle();
      this._children.forEach((child: ElementView) => {
        this.container.style.setGlobalStyle(child.style);
        this.rotate(child.angle);
        this.focus(child.rotatable);
      });
    } else {
      /* multiple elements */
      let rotatable: boolean = true;
      for (let child of this._children) {
        if (!child.rotatable) {
          rotatable = false;
          break;
        }
      }
      this.focus(rotatable);
    }

    this.fit();
  }

  clear(): void {
    this.container.style.recoverGlobalStyle();
    this._children.clear();
    this.blur();
  }

  remove(): void {
    this._children.forEach((child: ElementView) => this.container.remove(child));
    this.clear();
  }

  orderTop(): void {
    this._children.forEach((child: ElementView) => {
      this.container.elementsGroup.appendChild(child.SVG);
    });
  }
  orderUp(): void {}
  orderDown(): void {}
  orderBottom(): void {
    let firstChild = this.container.elementsGroup.firstChild;
    this._children.forEach((child: ElementView) => {
      this.container.elementsGroup.insertBefore(child.SVG, firstChild);
    });
  }

  get canGroup(): boolean {
    return this._children.size > 1;
  }

  get canUngroup(): boolean {
    if (this._children.size == 1) {
      let [element] = this._children;
      if (element instanceof GroupView)
        return true;
    }
    return false;
  }

  group(): void {
    if (this._children.size < 2) return;

    let group = new GroupView(this.container);
    this._children.forEach((element: ElementView) => {
      group.addElement(element);
      this.container.elements.delete(element);
      element.group = group;
    });

    this._children.clear();
    this.container.add(group);
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
  ungroup() {
    if (this._children.size > 1) return;
    let [group] = this._children;
    if (!(group instanceof GroupView)) /* can ungroup only single, group element */
      return;
    group.elements.forEach((element: ElementView) => {
      this.container.add(element);
    });


    this.container.remove(group);
  }

  get children(): Set<ElementView> {
    return this._children;
  }

  get position(): Point {
    return this.boundingBox.position;
  }

  set translate(delta: Point) {
    this._children.forEach((child: ElementView) => {
      child.SVG.style.transform =
        "translate(" + delta.x + "px, " + delta.y + "px) rotate(" + child.angle + "deg)";
    });
    this.svgGroup.style.transform =
        " translate(" + delta.x + "px, " + delta.y + "px)";
  }
  set position(delta: Point) {
    this._children.forEach((child: ElementView) => child.position = delta);

    let refPoint = {
      x: this.lastRefPoint.x + delta.x,
      y: this.lastRefPoint.y + delta.y
    };
    this.refPoint = refPoint;
    this.refPointView = refPoint;

    this.boundingBox.correctByDelta(delta);
  }

  correct(point: Point): void {
    this._children.forEach((child: ElementView) => child.correct(point, this.lastRefPoint));

    this.boundingBox.correct(point, this.lastRefPoint);
  }

  get rotatedCenter(): Point {
    return Matrix.rotate(
      [this.center],
      this.refPoint,
      -this.angle
    )[0];
  }

  get center(): Point {
    let rect = this.boundingRect;

    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
    }
  }

  get size(): Size {
    return this.boundingRect;
  }

  setSize(rect: Rect, delta: Point | null = null): void {
    if (this._children.size == 1) {
      this._children.forEach(child => child.setSize(rect, delta));
    } else {
      /* TODO */
    }
    this.fit();
  }

  private calculateBoundingRect(rotated: boolean): Rect {
    let minX, minY;
    let maxX, maxY;

    let children = Array.from(this._children);
    if (children.length < 1)
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

    for (let i = 1; i < children.length; i++) {
      let boundingRect = rotated ? children[i].rotatedBoundingRect : children[i].boundingRect;
      if (boundingRect.x < minX)
        minX = boundingRect.x;
      if (boundingRect.y < minY)
        minY = boundingRect.y;
      if (boundingRect.width + boundingRect.x > maxX)
        maxX = boundingRect.width + boundingRect.x;
      if (boundingRect.height + boundingRect.y > maxY)
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

  hasChild(xElement: ElementView): boolean {
    return this._children.has(xElement);
  }

  recenterRefPoint() {
    this.fixRefPoint();
    let center;
    if (this._children.size > 1) {
      this.fit();
      center = this.rotatedCenter;
      this.refPointView = center;
      this.refPoint = center;
      this.correct(center);
    } else {
      center = this.rotatedCenter;
      this.refPointView = center;
      this.refPoint = center;
      this.correct(center);
      this.fit();

      let [firstElement] = this._children;
      if (firstElement instanceof GroupView) {
        this.boundingBox.rotate(0);
      }
    }
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
    if (this._children.size == 1)
      this._children.forEach(child => child.rotate(angle));
    else
      this._children.forEach(child =>
        child.rotate((angle + child.lastAngle - this._lastAngle) % 360));
    this.boundingBox.rotate(angle);
  }

  fit(): void {
    if (this._children.size != 1) {
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

  focus(rotatable: boolean = true) {
    this.container.call(Callback.FOCUS_CHANGED);
    if (this._children.size > 1) {
      this.boundingBox.multipleFocus(rotatable);
    } else {
      let [singleElement] = this._children;

      if (singleElement instanceof GroupView) {
        this.boundingBox.multipleFocus(rotatable);
      } else {
        this.boundingBox.singleFocus(rotatable);
      }
    }
  }

  blur() {
    this.container.call(Callback.BLURED);
    this.boundingBox.blur();
  }

  highlight() {
    this._children.forEach((child: ElementView) => {
      child.highlight();
    });
  }

  lowlight() {
    this._children.forEach((child: ElementView) => {
      child.lowlight();
    });
  }

  toPath() {
    if (this._children.size == 0) return;
    let refPoint = Object.assign({}, this.refPoint);

    let path = new PathView(this.container);
    this._children.forEach((child: ElementView) => {
      path.add(child.toPath());
    });
    this.remove();

    this.container.add(path);
    this.container.focus(path);

    this.refPointView = refPoint;
    this.refPoint = refPoint;
  }
}
