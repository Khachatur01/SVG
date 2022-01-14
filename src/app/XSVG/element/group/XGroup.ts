import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {Rect} from "../../model/Rect";
import {Size} from "../../model/Size";
import {XPath} from "../pointed/path/XPath";
import {XSVG} from "../../XSVG";

export class XGroup extends XElement {
  private _elements: XElement[] = [];

  constructor(container: XSVG) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "g");
    this.style.fill = "transparent";
  }

  get elements(): XElement[] {
    return this._elements;
  }
  addElement(element: XElement) {
    this._elements.push(element);
    this.svgElement.appendChild(element.SVG);
  }
  removeElement(element: XElement) {
    this._elements.splice(this._elements.indexOf(element), 1);
    this.svgElement.removeChild(element.SVG);
  }

  get points(): Point[] {
    let points: Point[] = [];
    this._elements.forEach((element: XElement) => {
      element.points.forEach((point: Point) => {
        points.push(Object.assign({}, point));
      });
    });
    return points;
  }

  override get rotatedPoints(): Point[] {
    let points: Point[] = [];
    this._elements.forEach((element: XElement) => {
      let elementPoints = element.rotatedPoints;
      elementPoints.forEach((point: Point) => {
        points.push(Object.assign({}, point));
      });
    });
    return points;
  }

  get position(): Point {
    let points = this.rotatedPoints;

    let leftTop: Point = points[0];

    for(let i = 1; i < points.length; i++) {
      if (points[i].x < leftTop.x)
        leftTop.x = points[i].x;
      if (points[i].y < leftTop.y)
        leftTop.y = points[i].y;
    }
    return leftTop;
  }
  set position(delta: Point) {
    this._elements.forEach((element: XElement) => {
      element.position = delta;
    });
  }

  override correct(refPoint: Point, lastRefPoint: Point) {
    this._elements.forEach((child: XElement) => {
      child.correct(refPoint, lastRefPoint)
    });
  }

  get size(): Size {
    let points = this.rotatedPoints;

    let maxX = points[0].x;
    let maxY = points[0].y;
    let minX = points[0].x;
    let minY = points[0].y;

    for(let i = 1; i < points.length; i++) {
      if(points[i].x > maxX)
        maxX = points[i].x;
      if(points[i].y > maxY)
        maxY = points[i].y;
      if(points[i].x < minX)
        minX = points[i].x;
      if(points[i].y < minY)
        minY = points[i].y;
    }

    return  {
      width: maxX - minX,
      height: maxY - minY
    };
  }
  setSize(rect: Rect): void {
  }

  override get refPoint(): Point {
    return super.refPoint;
  }
  override set refPoint(point: Point) {
    super.refPoint = point;
    this._elements.forEach(child => child.refPoint = point);
  }
  override rotate(angle: number) {
    this._elements.forEach(child =>
      child.rotate((angle + child.lastAngle) % 360)
    );
  }

  override fixRect(): void {
    super.fixRect();
    this._elements.forEach((element: XElement) => element.fixRect());
  }
  override fixPosition(): void {
    super.fixPosition();
    this._elements.forEach((element: XElement) => element.fixPosition());
  }
  override fixSize(): void {
    super.fixSize();
    this._elements.forEach((element: XElement) => element.fixSize());
  }
  override fixAngle(): void {
    this._elements.forEach((element: XElement) => element.fixAngle());
  }


  toPath(): XPath {
    return new XPath(this.container);
  }
  isComplete(): boolean {
    return true;
  }
}
