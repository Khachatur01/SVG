import {ClickDraw} from "../../../mode/ClickDraw";
import {PolylineView} from "../../../../../../element/shape/pointed/polyline/PolylineView";
import {PointedView} from "../../../../../../element/shape/pointed/PointedView";
import {Point} from "../../../../../../model/Point";

export class DrawPolyline extends ClickDraw {
  onClick(position: Point): PointedView | null {
    if (!this.drawableElement) {
      this.drawableElement = new PolylineView(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }

}
