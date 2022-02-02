import {MoveDraw} from "../../../mode/MoveDraw";
import {ElementView} from "../../../../../../element/ElementView";
import {EllipseView} from "../../../../../../element/shape/EllipseView";
import {Point} from "../../../../../../model/Point";
import {SVG} from "../../../../../../SVG";
import {Callback} from "../../../../../../dataSource/Callback";

export class DrawEllipse extends MoveDraw {
  getDrawableElement(position: Point): ElementView {
    let element = new EllipseView(this.container, position.x, position.y);
    element.fixPosition();
    return element;
  }

  override start(container: SVG) {
    super.start(container);
    container.call(Callback.CIRCLE_TOOL_ON);
  }

  override stop() {
    super.stop();
    this.container.call(Callback.CIRCLE_TOOL_OFF);
  }
  _new(): DrawEllipse {
    return new DrawEllipse(this.container);
  }
}
