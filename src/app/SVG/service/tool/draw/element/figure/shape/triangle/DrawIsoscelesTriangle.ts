import {MoveDraw} from "../../../../mode/MoveDraw";
import {ElementView} from "../../../../../../../element/ElementView";
import {Point} from "../../../../../../../model/Point";
import {IsoscelesTriangleView} from "../../../../../../../element/shape/pointed/polygon/triangle/IsoscelesTriangleView";
import {SVG} from "../../../../../../../SVG";
import {Callback} from "../../../../../../../dataSource/Callback";

export class DrawIsoscelesTriangle extends MoveDraw {
  getDrawableElement(position: Point): ElementView {
    return new IsoscelesTriangleView(this.container);
  }
  override start(container: SVG) {
    super.start(container);
    container.call(Callback.ISOSCELES_TRIANGLE_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.ISOSCELES_TRIANGLE_TOOL_OFF);
  }
}
