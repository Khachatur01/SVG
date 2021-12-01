import {XRectangle} from "../../../element/shape/XRectangle";

export class XBoundingBox extends XRectangle {

  constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
    super(x, y, width, height);

    this.setAttr({
      fill: "none",
      stroke: "#002fff",
      "stroke-width": 1,
      "stroke-dasharray": "3 3"
    });

    this.svgElement.style.display = "none";
    this.removeOverEvent();
  }

}
