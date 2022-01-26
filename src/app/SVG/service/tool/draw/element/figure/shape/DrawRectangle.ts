import {MoveDraw} from "../../../mode/MoveDraw";
import {ElementView} from "../../../../../../element/ElementView";
import {RectangleView} from "../../../../../../element/shape/pointed/polygon/rectangle/RectangleView";
import {Point} from "../../../../../../model/Point";

export class DrawRectangle extends MoveDraw {
  onStart(position: Point): ElementView {
    return new RectangleView(this.container, position.x, position.y);
  }
}
