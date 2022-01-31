import {ElementView} from "../ElementView";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";
import {Size} from "../../model/Size";
import {PathView} from "../shape/pointed/PathView";
import {SVG} from "../../SVG";

export class GroupView extends ElementView {
  private _elements: ElementView[] = [];

  constructor(container: SVG) {
    super(container);
    this.svgElement = document.createElementNS(ElementView.svgURI, "g");
  }

  get copy(): GroupView {
    let group: GroupView = new GroupView(this._container);
    this._elements.forEach((element: ElementView) => {
      let copy = element.copy;
      copy.group = group;
      group.addElement(copy);
    });

    group.refPoint = Object.assign({}, this.refPoint);
    group._angle = (this._angle);

    group.style.set = this.style;

    return group;
  }

  get elements(): ElementView[] {
    return this._elements;
  }

  addElement(element: ElementView) {
    this._elements.push(element);
    this.svgElement.appendChild(element.SVG);
  }

  removeElement(element: ElementView) {
    this._elements.splice(this._elements.indexOf(element), 1);
    this.svgElement.removeChild(element.SVG);
  }

  get points(): Point[] {
    let points: Point[] = [];
    this._elements.forEach((element: ElementView) => {
      element.points.forEach((point: Point) => {
        points.push(Object.assign({}, point));
      });
    });
    return points;
  }

  override get rotatedPoints(): Point[] {
    let points: Point[] = [];
    this._elements.forEach((element: ElementView) => {
      let elementPoints = element.rotatedPoints;
      elementPoints.forEach((point: Point) => {
        points.push(Object.assign({}, point));
      });
    });
    return points;
  }

  get position(): Point {
    let boundingRect = this.rotatedBoundingRect;

    return {
      x: boundingRect.x,
      y: boundingRect.y
    };
  }

  set position(delta: Point) {
    this._elements.forEach((element: ElementView) => {
      element.position = delta;
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    this._elements.forEach((child: ElementView) => {
      child.correct(refPoint, lastRefPoint)
    });
  }

  get size(): Size {
    let boundingRect = this.rotatedBoundingRect;

    return {
      width: boundingRect.width,
      height: boundingRect.height
    };
  }

  setSize(rect: Rect): void {
    let delta = {
      x: rect.width / this._lastSize.width,
      y: rect.height / this._lastSize.height
    }
    this._elements.forEach((element: ElementView) => {
      element.setSize(rect, delta);
    });
  }

  get boundingRect(): Rect {
    return this.rotatedBoundingRect;
  }

  get rotatedBoundingRect(): Rect {
    let minX, minY;
    let maxX, maxY;

    let children = Array.from(this._elements);
    if (children.length < 1)
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

    let firstChild = children[0];

    let firstBoundingRect = firstChild.rotatedBoundingRect;

    minX = firstBoundingRect.x;
    minY = firstBoundingRect.y;
    maxX = firstBoundingRect.width + minX;
    maxY = firstBoundingRect.height + minY;

    for (let i = 1; i < children.length; i++) {
      let boundingRect = children[i].rotatedBoundingRect;
      if (boundingRect.x < minX)
        minX = boundingRect.x;
      if (boundingRect.y < minY)
        minY = boundingRect.y;
      if (boundingRect.width + boundingRect.x > maxX)
        maxX = boundingRect.width + boundingRect.x;
      if (boundingRect.height + boundingRect.y > maxY)
        maxY = boundingRect.height + boundingRect.y;
    }

    this._angle = 0;
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  override getAttr(attribute: string): string {
    let value = this._elements[0].SVG.getAttribute(attribute);
    if (!value)
      return "0";
    return value;
  }

  override setAttr(attributes: object): void {
    for (let element of this._elements)
      for (const [key, value] of Object.entries(attributes))
        if (key && value)
          element.SVG.setAttribute(key, "" + value);
  }

  override get refPoint(): Point {
    return super.refPoint;
  }

  override set refPoint(point: Point) {
    super.refPoint = point;
    this._elements.forEach(child => child.refPoint = point);
  }

  override rotate(angle: number) {
    this._angle = angle;
    this._elements.forEach(child =>
      child.rotate((angle + child.lastAngle - this._lastAngle) % 360)
    );
  }

  override fixRect(): void {
    super.fixRect();
    this._elements.forEach((element: ElementView) => element.fixRect());
  }

  override fixPosition(): void {
    super.fixPosition();
    this._elements.forEach((element: ElementView) => element.fixPosition());
  }

  override fixSize(): void {
    super.fixSize();
    this._elements.forEach((element: ElementView) => element.fixSize());
  }

  override fixAngle(): void {
    super.fixAngle();
    this._elements.forEach((element: ElementView) => element.fixAngle());
  }

  toPath(): PathView {
    return new PathView(this._container);
  }

  isComplete(): boolean {
    return true;
  }
}