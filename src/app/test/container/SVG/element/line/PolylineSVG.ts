import {ShapeSVG} from "../shape/ShapeSVG";
import {Position} from "../../SVG";
import {ElementSVG} from "../ElementSVG";

export class PolylineSVG extends ShapeSVG {
  private readonly svgElement: SVGPolylineElement;

  constructor(points: number[]) {
    super();
    this.svgElement = document.createElementNS(ElementSVG.svgURI, "polyline");
    this.setDefaultStyle();

    this.setAttr({
      points: points[0] + " " + points[1],
      fill: "none"
    });
  }

  get SVG(): SVGPolylineElement {
    return this.svgElement as SVGPolylineElement;
  }

  get position(): Position {
    let points: string[] = this.getAttr("points").split(" ");

    return {
      x: parseInt(points[0]),
      y: parseInt(points[1])
    }
  }
  set position(position: Position) {
    let points: string[] = this.getAttr("points").split(" ");
    let dx = position.x - parseInt(points[0]);
    let dy = position.y - parseInt(points[1]);

    for(let i = 0; i < points.length; i++) {
      if(i % 2 == 0) {
        points[i] = (parseInt(points[i]) + dx).toString(10);
      } else {
        points[i] = (parseInt(points[i]) + dy).toString(10);
      }
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
