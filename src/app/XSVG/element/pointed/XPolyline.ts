import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {XPointed} from "../type/XPointed";
import {XSVG} from "../../XSVG";

export class XPolyline extends XPointed {
  constructor(container: XSVG, points: Point[]) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "polyline");

    this.points = points;
    this.style.setDefaultStyle();

    this.setOverEvent();
  }

  // TODO fix coordinate fetching
  override get points(): Point[] {
    let points: string[] = this.getAttr("points").split(" ");
    let pointsArray: Point[] = [];

    for(let i = 0; i < points.length; i+= 2) {
      pointsArray.push({
        x: parseInt(points[i]),
        y: parseInt(points[i + 1])
      });
    }

    return pointsArray;
  }
  override set points(points: Point[]) {
    let pointsString: string = "";
    for(let point of points) {
      pointsString += point.x + " " + point.y + " "
    }
    pointsString = pointsString.trimEnd();
    this.setAttr({points: pointsString})
  }
  override pushPoint(point: Point) {
    this.setAttr({
      "points": this.getAttr("points") + " " + point.x + " " + point.y
    });
  }
  override removePoint(index: number): void {
    let pointsArr = this.getAttr("points").split(" ");
    if(index < 0)
      index = pointsArr.length / 2 + index;

    pointsArr.splice(index * 2, 2)

    this.setAttr({
      "points": pointsArr.join(" ")
    });
  }
  override replacePoint(index: number, point: Point) {
    let points = this.points;
    if(index < 0)
      index = points.length + index;
    points[index] = point;

    this.points = points;
  }
  override isComplete(): boolean {
    let pointsArr = this.getAttr("points").split(" ", 6);
    return pointsArr.length >= 6;
  }

}
