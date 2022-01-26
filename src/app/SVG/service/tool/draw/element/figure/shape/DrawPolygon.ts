import {ClickDraw} from "../../../mode/ClickDraw";
import {PolygonView} from "../../../../../../element/shape/pointed/polygon/PolygonView";
import {PointedView} from "../../../../../../element/shape/pointed/PointedView";
import {Point} from "../../../../../../model/Point";

export class DrawPolygon extends ClickDraw {
  onClick(position: Point): PointedView | null {
    if (!this.drawableElement) {
      this.drawableElement = new PolygonView(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }
}
