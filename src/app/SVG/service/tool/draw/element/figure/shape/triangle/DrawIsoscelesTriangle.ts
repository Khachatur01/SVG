import {MoveDraw} from "../../../../mode/MoveDraw";
import {Element} from "../../../../../../../element/Element";
import {Point} from "../../../../../../../model/Point";
import {IsoscelesTriangle} from "../../../../../../../element/shape/pointed/polygon/triangle/IsoscelesTriangle";

export class DrawIsoscelesTriangle extends MoveDraw {
  onStart(position: Point): Element {
    return new IsoscelesTriangle(this.container);
  }
}
