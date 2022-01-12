import {Point} from "../../../../../../../model/Point";
import {XElement} from "../../../../../../../element/XElement";
import {MoveDraw} from "../../../../mode/MoveDraw";
import {XRightTriangle} from "../../../../../../../element/shape/triangle/XRightTriangle";

export class DrawRightTriangle extends MoveDraw {
  onStart(position: Point): XElement {
    return new XRightTriangle(this.container);
  }
}
