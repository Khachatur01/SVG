import {Point} from "../../../../../model/Point";
import {XRectangle} from "../../../../../element/shape/XRectangle";

export abstract class Grip extends XRectangle {
  protected side: number = 8;
  protected constructor(cursor: string) {
    super(0, 0, 8, 8);
    this.svgElement.style.cursor = cursor;
    this.setAttr({
      fill: "white",
      "stroke-width": 1,
      stroke: "#002fff"
    });

    this.svgElement.style.display = "none";
  }

  override highlight() {
    this.setAttr({
      stroke: "#00ff00"
    });
  }
  override lowlight() {
    this.setAttr({
      stroke: "#002fff"
    });
  }

  show() {
    this.svgElement.style.display = "block";
  }
  hide() {
    this.svgElement.style.display = "none";
  }

  abstract setPosition(points: Point[]): void;
}
