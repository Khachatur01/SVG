import {MoveDraw} from "../../../mode/MoveDraw";
import {LineView} from "../../../../../../element/shape/pointed/LineView";
import {Point} from "../../../../../../model/Point";
import {Angle} from "../../../../../math/Angle";
import {ElementView} from "../../../../../../element/ElementView";
import {SVG} from "../../../../../../SVG";
import {Callback} from "../../../../../../dataSource/Callback";
import {PointedView} from "../../../../../../element/shape/pointed/PointedView";

export class DrawLine extends MoveDraw {
  protected createDrawableElement(position: Point): ElementView {
    let element = new LineView(this.container, position, position);
    element.fixPosition();
    return element;
  }

  protected override draw(event: MouseEvent) {
    if (!this.container || !this.drawableElement) return;

    let containerRect = this.container.HTML.getBoundingClientRect();
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;

    if (this.container.grid.isSnap()) {
      let snapPoint = this.container.grid.getSnapPoint({
        x: x2,
        y: y2
      });
      x2 = snapPoint.x;
      y2 = snapPoint.y;
    } else if (this.container.perfect) {
      let position: Point = Angle.snapLineEnd(this.startPos, {x: x2, y: y2}) as Point;
      x2 = position.x;
      y2 = position.y;
    }

    (this.drawableElement as PointedView).replacePoint(1, {x: x2, y: y2});

    this.container.call(Callback.DRAW_MOVE,
      {position: {x: x2, y: y2}}
    );
  }

  public override start(container: SVG) {
    super.start(container);
    container.call(Callback.LINE_TOOL_ON);
  }
  public override stop() {
    super.stop();
    this.container.call(Callback.LINE_TOOL_OFF);
  }

  public _new(): DrawLine {
    return new DrawLine(this.container);
  }
}
