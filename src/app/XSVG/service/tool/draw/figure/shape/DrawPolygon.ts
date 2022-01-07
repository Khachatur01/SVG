import {ClickDraw} from "../../mode/ClickDraw";
import {XPolygon} from "../../../../../element/pointed/XPolygon";
import {XPointed} from "../../../../../element/type/XPointed";
import {Point} from "../../../../../model/Point";

export class DrawPolygon extends ClickDraw {
  onClick(position: Point): XPointed | null {
    if(!this.drawableElement) {
      this.drawableElement = new XPolygon(this.container, [
        position, position
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint(position);

    return null;
  }
}
