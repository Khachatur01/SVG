import {ShapeSVG} from "./ShapeSVG";
import {Position} from "../../SVG";
import {ElementSVG} from "../ElementSVG";

export class PolygonSVG extends ShapeSVG {
  private readonly svgElement: SVGPolygonElement;

  constructor(points: number[]) {
    super();
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "polygon");
    this.setDefaultStyle();

    this.setAttr({
      points: points[0] + "," + points[1],
      fill: "none"
    });
  }

  get SVG(): SVGPolygonElement {
    return this.svgElement as SVGPolygonElement;
  }

  get position(): Position {
    let points: string[] = this.getAttr("points").split(" ")[0].split(",");

    return {
      x: parseInt(points[0]),
      y: parseInt(points[1])
    }
  }
  set position(position: Position) {
    let points: string[] = this.getAttr("points").split(" ");
    let pointArr: string[] = points[0].split(",");
    let dx = position.x - parseInt(pointArr[0]);
    let dy = position.y - parseInt(pointArr[1]);

    for(let i = 0; i < points.length; i++) {
      let pointArr: string[] = points[i].split(",");

      pointArr[0] = (parseInt(pointArr[0]) + dx).toString(10);
      pointArr[1] = (parseInt(pointArr[1]) + dy).toString(10);

      points[i] = pointArr.join(",");
    }

    this.setAttr({
      points: points.join(" ")
    });

    if(this.boundingBox) {
      let bBox: DOMRect = this.SVG.getBBox();
      this.boundingBox.position = {x: bBox.x, y: bBox.y} as Position;
    }
  }

}
