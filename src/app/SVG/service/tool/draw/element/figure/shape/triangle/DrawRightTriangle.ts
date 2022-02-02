import {Point} from "../../../../../../../model/Point";
import {ElementView} from "../../../../../../../element/ElementView";
import {MoveDraw} from "../../../../mode/MoveDraw";
import {RightTriangleView} from "../../../../../../../element/shape/pointed/polygon/triangle/RightTriangleView";
import {SVG} from "../../../../../../../SVG";
import {Callback} from "../../../../../../../dataSource/Callback";

export class DrawRightTriangle extends MoveDraw {
  getDrawableElement(position: Point): ElementView {
    return new RightTriangleView(this.container);
  }
  override start(container: SVG) {
    super.start(container);
    container.call(Callback.RIGHT_TRIANGLE_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.RIGHT_TRIANGLE_TOOL_OFF);
  }
  _new(): DrawRightTriangle {
    return new DrawRightTriangle(this.container);
  }
}
