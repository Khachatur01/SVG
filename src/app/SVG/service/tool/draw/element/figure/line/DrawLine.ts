import {MoveDraw} from "../../../mode/MoveDraw";
import {LineView} from "../../../../../../element/shape/pointed/LineView";
import {Point} from "../../../../../../model/Point";
import {Angle} from "../../../../../math/Angle";
import {PointedView} from "../../../../../../element/shape/pointed/PointedView";
import {ElementView} from "../../../../../../element/ElementView";

export class DrawLine extends MoveDraw {
  onStart(position: Point): ElementView {
    let element = new LineView(this.container, position.x, position.y, position.x, position.y);
    element.fixPosition();
    return element;
  }

  override onDraw(containerRect: DOMRect, event: MouseEvent, xPointed: PointedView, perfectMode: boolean): void {
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;

    if (this.container.grid.isSnap()) {
      let snapPoint = this.container.grid.getSnapPoint({
        x: x2,
        y: y2
      });
      x2 = snapPoint.x;
      y2 = snapPoint.y;
    } else if (perfectMode) {
      let position: Point = Angle.snapLineEnd(this.startPos.x, x2, this.startPos.y, y2) as Point;
      x2 = position.x;
      y2 = position.y;
    }

    xPointed.replacePoint(1, {x: x2, y: y2});

  }

}
