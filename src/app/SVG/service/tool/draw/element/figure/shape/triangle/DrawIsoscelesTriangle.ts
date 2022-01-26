import {MoveDraw} from "../../../../mode/MoveDraw";
import {ElementView} from "../../../../../../../element/ElementView";
import {Point} from "../../../../../../../model/Point";
import {IsoscelesTriangleView} from "../../../../../../../element/shape/pointed/polygon/triangle/IsoscelesTriangleView";

export class DrawIsoscelesTriangle extends MoveDraw {
  onStart(position: Point): ElementView {
    return new IsoscelesTriangleView(this.container);
  }
}
