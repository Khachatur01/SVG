import {ClickDraw} from "../../../mode/ClickDraw";
import {XPolyline} from "../../../../../../element/shape/pointed/polyline/XPolyline";
import {XPointed} from "../../../../../../element/shape/pointed/XPointed";
import {Point} from "../../../../../../model/Point";

export class DrawPolyline extends ClickDraw {
  onClick(position: Point): XPointed | null {
    if(!this.drawableElement) {
      this.drawableElement = new XPolyline(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }

}
