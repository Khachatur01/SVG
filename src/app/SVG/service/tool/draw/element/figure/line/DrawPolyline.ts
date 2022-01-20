import {ClickDraw} from "../../../mode/ClickDraw";
import {Polyline} from "../../../../../../element/shape/pointed/polyline/Polyline";
import {Pointed} from "../../../../../../element/shape/pointed/Pointed";
import {Point} from "../../../../../../model/Point";

export class DrawPolyline extends ClickDraw {
  onClick(position: Point): Pointed | null {
    if(!this.drawableElement) {
      this.drawableElement = new Polyline(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }

}
