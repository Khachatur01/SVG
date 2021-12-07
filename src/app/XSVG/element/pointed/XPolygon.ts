import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {XPointed} from "../type/XPointed";

export class XPolygon extends XPointed {
  constructor(points: Point[]) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "polygon");

    this.points = points;

    this.setOverEvent();
    this.setDefaultStyle();
  }

  /* TODO fix coordinate fetching */
  override get points(): Point[] {
    let points: string[] = this.getAttr("points").split(" ");
    let pointsArray: Point[] = [];
    for(let point of points) {
      let pointSplit = point.split(",");
      pointsArray.push({
        x: parseInt(pointSplit[0]),
        y: parseInt(pointSplit[1])
      });
    }
    return pointsArray;
  }
  override set points(points: Point[]) {
    let pointsString = "";
    for(let point of points) {
      pointsString += point.x + "," + point.y + " "
    }
    pointsString = pointsString.trimEnd();
    this.setAttr({points: pointsString})
  }
  override pushPoint(point: Point) {
    this.setAttr({
        "points": this.getAttr("points") + " " + point.x + "," + point.y
    });
  }
  override removePoint(index: number): void {
    let pointsArr = this.getAttr("points").split(" ");
    if(index < 0)
      index = pointsArr.length + index;
    pointsArr.splice(index, 1)

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
    let pointsArr = this.getAttr("points").split(" ", 3);
    return pointsArr.length >= 3;
  }

}
