import {XElement} from "../XElement";
import {Pointed} from "../pointed/Pointed";
import {Point} from "../../model/Point";
import {XBoundingBox} from "../../service/edit/bound/XBoundingBox";

export class XPolyline extends XElement implements Pointed {
  constructor(points: Point[]) {
    super();
    this.svgElement = document.createElementNS(XElement.svgURI, "polyline");

    this.setAttr({
      fill: "none",
      stroke: "black",
      "stroke-width": 2
    });
    this.points = points;

    this.setOverEvent();
    let bBox:DOMRect =  this.svgElement.getBoundingClientRect();
    this.xBoundingBox = new XBoundingBox(bBox.x, bBox.y, bBox.width, bBox.height);

    this.svgGroup.appendChild(this.svgElement);
    this.svgGroup.appendChild(this.xBoundingBox.SVG);
  }

  // TODO fix coordinate fetching
  get points(): Point[] {
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
  set points(points: Point[]) {
    let pointsString: string = "";
    for(let point of points) {
      pointsString += point.x + " " + point.y + " "
    }
    pointsString = pointsString.trimEnd();
    this.setAttr({points: pointsString})
  }
  pushPoint(point: Point) {
    this.setAttr({
      "points": this.getAttr("points") + " " + point.x + " " + point.y
    });
  }
  removePoint(index: number): void {
    let pointsArr = this.getAttr("points").split(" ");
    if(index < 0)
      index = pointsArr.length / 2 + index;

    pointsArr.splice(index * 2, 2)

    this.setAttr({
      "points": pointsArr.join(" ")
    });
  }
  isSingleLine(): boolean {
    let pointsArr = this.getAttr("points").split(" ", 6);
    return  pointsArr.length < 6;
  }
}
