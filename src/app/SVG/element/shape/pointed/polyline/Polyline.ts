import {Element} from "../../../Element";
import {Point} from "../../../../model/Point";
import {Pointed} from "../Pointed";
import {SVG} from "../../../../SVG";

export class Polyline extends Pointed {
  constructor(container: SVG, points: Point[] = []) {
    super(container);
    this.svgElement = document.createElementNS(Element.svgURI, "polyline");
    this.svgElement.id = this.id;

    this.points = points;
    this.style.setDefaultStyle();

    this.setOverEvent();
  }

  get copy(): Polyline {
    let polyline: Polyline = new Polyline(this._container);
    polyline.points = this.points;

    polyline.refPoint = Object.assign({}, this.refPoint);
    polyline.rotate(this._angle);

    polyline.style.set = this.style;

    return polyline;
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
  override getPoint(index: number): Point {
    let points = this.points;
    if(index < 0)
      index = points.length + index;
    return points[index];
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
