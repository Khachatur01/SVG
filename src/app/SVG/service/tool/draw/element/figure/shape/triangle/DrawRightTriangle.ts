import {Point} from "../../../../../../../model/Point";
import {ElementView} from "../../../../../../../element/ElementView";
import {MoveDraw} from "../../../../mode/MoveDraw";
import {RightTriangleView} from "../../../../../../../element/shape/pointed/polygon/triangle/RightTriangleView";

export class DrawRightTriangle extends MoveDraw {
  onStart(position: Point): ElementView {
    return new RightTriangleView(this.container);
  }
}
