import {Element} from "../../Element";
import {Pointed} from "./Pointed";
import {Point} from "../../../model/Point";
import {SVG} from "../../../SVG";

export class Line extends Pointed {
  constructor(container: SVG, x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
    super(container);
    this.svgElement = document.createElementNS(Element.svgURI, "line");
    this.setAttr({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    });
    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  get copy(): Line {
    let line: Line = new Line(this._container);
    line.points = this.points;

    line.refPoint = Object.assign({}, this.refPoint);
    line.rotate(this._angle);

    line.style.set = this.style.get;

    return line;
  }
  override get points(): Point[] {
    return [
      {x: parseFloat(this.getAttr("x1")), y: parseFloat(this.getAttr("y1"))},
      {x: parseFloat(this.getAttr("x2")), y: parseFloat(this.getAttr("y2"))}
    ];
  }
  override set points(points: Point[]) {
    this.setAttr({
      x1: points[0].x,
      y1: points[0].y,
      x2: points[1].x,
      y2: points[1].y
    });
  }

  override getPoint(index: number): Point {
    return {
      x: parseFloat(this.getAttr("x2")),
      y: parseFloat(this.getAttr("y2"))
    };
  }

  override pushPoint(point: Point): void {
  }

  override removePoint(index: number): void {
  }

  override replacePoint(index: number, point: Point) {
    if(index == 0) {
      this.setAttr({x1: point.x});
      this.setAttr({y1: point.y});
    }
    if(index == 1) {
      this.setAttr({x2: point.x});
      this.setAttr({y2: point.y});
    }
  }

  override isComplete(): boolean {
    return this.getAttr("x1") != this.getAttr("x2") ||
      this.getAttr("y1") != this.getAttr("y2")
  }
}