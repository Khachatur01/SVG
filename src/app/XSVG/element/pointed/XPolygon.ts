import {XElement} from "../XElement";
import {Point} from "../../model/Point";
import {XPointed} from "../type/XPointed";
import {XSVG} from "../../XSVG";
import {XPath} from "./XPath";
import {Close} from "../../model/path/close/Close";

export class XPolygon extends XPointed {
  constructor(container: XSVG, points: Point[] = []) {
    super(container);
    this.svgElement = document.createElementNS(XElement.svgURI, "polygon");

    this.points = points;

    this.setOverEvent();
    this.style.setDefaultStyle();
  }

  get copy(): XPolygon {
    let polygon: XPolygon = new XPolygon(this._container);
    polygon.points = this.points;

    polygon.refPoint = Object.assign({}, this.refPoint);
    polygon.rotate(this._angle);

    polygon.style.set = this.style.get;

    return polygon;
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
  override getPoint(index: number): Point {
    let points = this.points;
    if(index < 0)
      index = points.length + index;
    return points[index];
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

  override toPath(): XPath {
    let path = super.toPath();
    path.addCommand(new Close());
    return path;
  }
}
