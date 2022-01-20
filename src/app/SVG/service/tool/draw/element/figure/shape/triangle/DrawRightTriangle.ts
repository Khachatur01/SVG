import {Point} from "../../../../../../../model/Point";
import {Element} from "../../../../../../../element/Element";
import {MoveDraw} from "../../../../mode/MoveDraw";
import {RightTriangle} from "../../../../../../../element/shape/pointed/polygon/triangle/RightTriangle";

export class DrawRightTriangle extends MoveDraw {
  onStart(position: Point): Element {
    return new RightTriangle(this.container);
  }
}
