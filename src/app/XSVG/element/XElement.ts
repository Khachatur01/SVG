import {Point} from "../model/Point";
import {Size} from "../model/Size";
import {XResizeable} from "../service/edit/resize/XResizeable";
import {Rect} from "../model/Rect";
import {XDraggable} from "../service/tool/drag/XDraggable";
import {Matrix} from "../service/math/Matrix";

class Style {
  private element: XElement;
  public static globalStyle: any = {
    "fill": "none",
    "stroke": "#000000",
    "stroke-width": 5,
    "stroke-dasharray": ""
  };
  constructor(element: XElement) {
    this.element = element;
  }
  set strokeWidth(width: string) {
    this.element.setAttr({
        "stroke-width": width
    });
  }
  set strokeColor(color: string) {
    this.element.setAttr({
        "stroke": color
    });
  }
  set strokeDashArray(array: string) {
    this.element.setAttr({
      "stroke-dasharray": array
    });
  }
  set fill(color: string) {
    this.element.setAttr({
      "fill": color
    });
  }

  setGlobalStyle(key: string, value: string) {
    Style.globalStyle[key] = value;
  }

  setDefaultStyle(): void {
    this.element.setAttr(Style.globalStyle);
  }
}

export abstract class XElement implements XResizeable, XDraggable {
  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";


  public readonly style = new Style(this);
  protected _lastPosition: Point = {x: 0, y: 0};
  protected _lastSize: Size = {width: 0, height: 0};

  protected _angle: number = 0;
  protected _refPoint: Point = {x: 0, y: 0};

  protected svgElement: SVGElement = document.createElementNS(XElement.svgURI, "rect"); // default element

  private _highlight = this.highlight.bind(this);
  private _lowlight = this.lowlight.bind(this);

  abstract get size(): Size;
  abstract setSize(rect: Rect): void;
  abstract isComplete(): boolean;
  abstract get position(): Point;
  abstract set position(delta: Point);
  abstract get points(): Point[];

  get rotatedPoints(): Point[] {
    return Matrix.rotate(
      this.points,
      this._refPoint,
      -this._angle
    );
  }

  get rotatedBoundingRect(): Rect {
    let points = this.rotatedPoints;
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    for(let i = 1; i < points.length; i++) {
      if(points[i].x < minX)
        minX = points[i].x;
      if (points[i].y < minY)
        minY = points[i].y;

      if(points[i].x > maxX)
        maxX = points[i].x;
      if(points[i].y > maxY)
        maxY = points[i].y;
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  get center(): Point {
    let position = this.position;
    let size = this.size;

    return {
      x: position.x + size.width / 2,
      y: position.y + size.height / 2
    }
  }

  get refPoint(): Point {
    return this._refPoint;
  }
  set refPoint(refPoint: Point) {
    this.svgElement.style.transformOrigin = refPoint.x + "px " + refPoint.y + "px";
    this._refPoint = refPoint;
  }

  get angle(): number {
    return this._angle;
  }
  rotate(angle: number): void {
    this.svgElement.style.transform = "rotate(" + angle + "deg)";
    this._angle = angle;
  }

  get SVG(): SVGElement {
    return this.svgElement;
  }
  getAttr(attribute: string): string {
    let value = this.SVG.getAttribute(attribute);
    if (!value)
      return "0";
    return value;
  }

  setAttr(attributes: object): void {
    for (const [key, value] of Object.entries(attributes))
      if (key && value)
        this.SVG.setAttribute(key, "" + value);
  }

  // setStyle(attributes: object): void {
  //   this.setAttr(attributes);
  //   for(const [key, value] of Object.entries(attributes)) {
  //     this.style[key] = value;
  //   }
  // }
  //
  // setDefaultStyle(): void {
  //   this.setAttr(XElement.globalStyle);
  //   for(const [key, value] of Object.entries(XElement.globalStyle)) {
  //     this.style[key] = value;
  //   }
  // }

  setOverEvent(): void {
    this.svgElement.addEventListener("mouseover", this._highlight);
    this.svgElement.addEventListener("mouseout", this._lowlight);
  }
  removeOverEvent(): void {
    this.svgElement.removeEventListener("mouseover", this._highlight);
    this.svgElement.removeEventListener("mouseout", this._lowlight);
  }

  remove() {
    this.svgElement.remove();
  }

  highlight(): void {
    this.svgElement.style.filter = "drop-shadow(0px 0px 5px rgb(0 0 0 / 0.7))"
  }

  lowlight(): void {
    this.svgElement.style.filter = "unset"
  }

  fixRect(): void {
    this._lastPosition = this.position;
    this._lastSize = this.size;
  }
  fixPosition(): void {
    this._lastPosition = this.position;
  }
  fixSize(): void {
    this._lastSize = this.size;
  }
  get lastRect(): Rect {
    return {
      x: this._lastPosition.x,
      y: this._lastPosition.y,
      width: this._lastSize.width,
      height: this._lastSize.height
    }
  }

  centerRefPoint() {
    this.refPoint = {
      x: this._lastPosition.x + this._lastSize.width / 2,
      y: this._lastPosition.y + this._lastSize.height / 2
    };
  }
}


