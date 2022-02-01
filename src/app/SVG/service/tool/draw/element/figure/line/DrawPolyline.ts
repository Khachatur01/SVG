import {ClickDraw} from "../../../mode/ClickDraw";
import {PolylineView} from "../../../../../../element/shape/pointed/polyline/PolylineView";
import {PointedView} from "../../../../../../element/shape/pointed/PointedView";
import {Point} from "../../../../../../model/Point";
import {SVG} from "../../../../../../SVG";
import {Callback} from "../../../../../../dataSource/Callback";

export class DrawPolyline extends ClickDraw {
  getDrawableElement(position: Point): PointedView {
    return new PolylineView(this.container, [
      position, position
    ]);
  }

  override start(container: SVG) {
    super.start(container);
    container.call(Callback.POLYLINE_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.POLYLINE_TOOL_OFF);
  }
}
