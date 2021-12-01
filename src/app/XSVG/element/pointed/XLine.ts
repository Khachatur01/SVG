import {XElement} from "../XElement";
import {Size} from "../../model/Size";
import {XPointed} from "../type/XPointed";
import {Point} from "../../model/Point";

export class XLine extends XPointed {
  constructor(x1: number, y1: number, x2: number, y2: number) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "line");
    this.setAttr({
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    });
    this.setOverEvent();
    this.setDefaultStyle();
  }

  override get points(): Point[] {
    return [
      {x: parseFloat(this.getAttr("x1")), y: parseFloat(this.getAttr("y1"))},
      {x: parseFloat(this.getAttr("x2")), y: parseFloat(this.getAttr("y2"))}
    ];
  }
  override set points(points: Point[]) {
    this.setAttr({
      x1: points[0].x + "",
      y1: points[0].y + "",
      x2: points[1].x + "",
      y2: points[1].y + ""
    });
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
