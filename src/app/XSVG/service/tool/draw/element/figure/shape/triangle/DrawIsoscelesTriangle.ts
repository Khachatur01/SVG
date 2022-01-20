import {MoveDraw} from "../../../../mode/MoveDraw";
import {XElement} from "../../../../../../../element/XElement";
import {Point} from "../../../../../../../model/Point";
import {XIsoscelesTriangle} from "../../../../../../../element/shape/pointed/polygon/triangle/XIsoscelesTriangle";

export class DrawIsoscelesTriangle extends MoveDraw {
  onStart(position: Point): XElement {
    return new XIsoscelesTriangle(this.container);
  }
}
