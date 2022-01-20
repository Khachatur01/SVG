import {Point} from "../model/Point";
import {Size} from "../model/Size";
import {Resizeable} from "../service/edit/resize/Resizeable";
import {Rect} from "../model/Rect";
import {Draggable} from "../service/tool/drag/Draggable";
import {Matrix} from "../service/math/Matrix";
import {SVG} from "../SVG";
import {Path} from "./shape/pointed/Path";
import {Group} from "./group/Group";

class Style {
  private element: Element;
  constructor(element: Element) {
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

  get get(): object {
    return {
      "fill": this.element.getAttr("fill"),
      "stroke": this.element.getAttr("stroke"),
      "stroke-width": this.element.getAttr("stroke-width"),
      "stroke-dasharray": this.element.getAttr("stroke-dasharray")
    }
  }
  set set(style: object) {
    this.element.setAttr(style);
  }

  setDefaultStyle(): void {
    this.element.setAttr(this.element.container.style.globalStyle);
  }
}

export abstract class Element implements Resizeable, Draggable {
  public static readonly svgURI: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

  public readonly style;
  protected _container: SVG;
  protected _lastPosition: Point = {x: 0, y: 0};
  protected _lastSize: Size = {width: 0, height: 0};
  protected _lastAngle: number = 0;

  protected _angle: number = 0;
  protected _refPoint: Point = {x: 0, y: 0};

  private _group: Group | null = null;

  protected svgElement: SVGElement = document.createElementNS(Element.svgURI, "rect"); // default element

  private _highlight = this.highlight.bind(this);
  private _lowlight = this.lowlight.bind(this);

  constructor(container: SVG) {
    this._container = container;
    this.style = new Style(this);
  }

  abstract get size(): Size;
  abstract setSize(rect: Rect, delta: Point | null): void;
  abstract isComplete(): boolean;
  abstract get position(): Point;
  abstract set position(delta: Point);
  abstract get points(): Point[];
  abstract get boundingRect(): Rect;
  abstract get rotatedBoundingRect(): Rect;
  abstract toPath(): Path;
  abstract get copy(): Element;

  get container(): SVG {
    return this._container;
  }
  set container(container: SVG) {
    this._container = container;
  }
  correct(refPoint: Point, lastRefPoint: Point): void {};

  getCorrectionDelta(refPoint: Point, lastRefPoint: Point) {
    /* calculate delta */
    let rotatedRefPoint = Matrix.rotate(
      [{x: lastRefPoint.x, y: lastRefPoint.y}],
      {x: refPoint.x, y: refPoint.y},
      this.angle
    )[0];
    /* correct by delta */
    return {
      x: Math.round(rotatedRefPoint.x - lastRefPoint.x),
      y: Math.round(rotatedRefPoint.y - lastRefPoint.y)
    };

  }

  get group(): Group | null {
    return this._group;
  }

  set group(group: Group | null) {
    this._group = group;
  }

  get rotatedPoints(): Point[] {
    return Matrix.rotate(
      this.points,
      this._refPoint,
      -this._angle
    );
  }

  protected calculateBoundingBox(points: Point[]): Rect {
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

  get rotatedCenter(): Point {
    return Matrix.rotate(
      [this.center],
      this._refPoint,
      -this._angle
    )[0];
  }
  get center(): Point {
    let rect = this.boundingRect;

    return {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2
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
  getStyle(key: string): string {
    return "";
  }
  setStyle(styles: object): void {

  }

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
    if(this._container.selectTool.isOn())
      this.svgElement.style.filter = "drop-shadow(0px 0px 5px rgb(0 0 0 / 0.7))";
  }

  lowlight(): void {
    this.svgElement.style.filter = "unset";
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
  fixAngle(): void {
    this._lastAngle = this._angle;
  }
  get lastRect(): Rect {
    return {
      x: this._lastPosition.x,
      y: this._lastPosition.y,
      width: this._lastSize.width,
      height: this._lastSize.height
    }
  }
  get lastAngle(): number {
    return this._lastAngle;
  }

  centerRefPoint() {
    this.refPoint = {
      x: this._lastPosition.x + this._lastSize.width / 2,
      y: this._lastPosition.y + this._lastSize.height / 2
    };
  }

  /* style */
  set strokeWidth(width: string) {

  }
  /* style */
}

