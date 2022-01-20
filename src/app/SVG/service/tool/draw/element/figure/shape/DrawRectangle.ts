import {MoveDraw} from "../../../mode/MoveDraw";
import {Element} from "../../../../../../element/Element";
import {Rectangle} from "../../../../../../element/shape/pointed/polygon/rectangle/Rectangle";
import {Point} from "../../../../../../model/Point";

export class DrawRectangle extends MoveDraw {
  onStart(position: Point): Element {
    return new Rectangle(this.container, position.x, position.y);
  }
}
