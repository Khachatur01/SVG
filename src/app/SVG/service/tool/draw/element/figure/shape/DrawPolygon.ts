import {ClickDraw} from "../../../mode/ClickDraw";
import {Polygon} from "../../../../../../element/shape/pointed/polygon/Polygon";
import {Pointed} from "../../../../../../element/shape/pointed/Pointed";
import {Point} from "../../../../../../model/Point";

export class DrawPolygon extends ClickDraw {
  onClick(position: Point): Pointed | null {
    if (!this.drawableElement) {
      this.drawableElement = new Polygon(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }
}
