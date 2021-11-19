import {XElement} from "../XElement";
import {Pointed} from "../pointed/Pointed";
import {Point} from "../../model/Point";

export class XPolygon extends XElement implements Pointed {
  private readonly svgElement: SVGPolygonElement;

  constructor(points: Point[]) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "polygon");

    this.setAttr({
      fill: "none",
      stroke: "black",
      "stroke-width": 2
    });
    this.points = points;

    this.setOverEvent();
  }
  get position(): Point {
    let points: Point[] = this.points;

    return {
      x: points[0].x,
      y: points[0].y
    }
  }
  set position(position: Point) {
    let points: Point[] = this.points;

    let dx: number = position.x - points[0].x;
    let dy: number = position.y - points[0].y;

    for(let point of points) {
      point.x += dx;
      point.y += dy;
    }
    this.points = points;
  }

  get SVG(): SVGElement {
    return this.svgElement;
  }


  // TODO fix coordinate fetching
  get points(): Point[] {
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
  set points(points: Point[]) {
    let pointsString = "";
    for(let point of points) {
      pointsString += point.x + "," + point.y + " "
    }
    pointsString = pointsString.trimEnd();
    this.setAttr({points: pointsString})
  }
  pushPoint(point: Point) {
    this.setAttr({
        "points": this.getAttr("points") + " " + point.x + "," + point.y
    });
  }
  removePoint(index: number): void {
    let pointsArr = this.getAttr("points").split(" ");
    if(index < 0)
      index = pointsArr.length + index;
    pointsArr.splice(index, 1)

    this.setAttr({
      "points": pointsArr.join(" ")
    });
  }
}
