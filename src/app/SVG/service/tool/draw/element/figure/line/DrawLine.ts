import {MoveDraw} from "../../../mode/MoveDraw";
import {Line} from "../../../../../../element/shape/pointed/Line";
import {Point} from "../../../../../../model/Point";
import {Angle} from "../../../../../math/Angle";
import {Pointed} from "../../../../../../element/shape/pointed/Pointed";
import {Element} from "../../../../../../element/Element";

export class DrawLine extends MoveDraw {
  onStart(position: Point): Element {
    let element = new Line(this.container, position.x, position.y, position.x, position.y);
    element.fixPosition();
    return element;
  }

  override onDraw(containerRect: DOMRect, event: MouseEvent, xPointed: Pointed, perfectMode: boolean): void {
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;

    if(this.container.grid.isSnap()) {
      let snapPoint = this.container.grid.getSnapPoint({
        x: x2,
        y: y2
      });
      x2 = snapPoint.x;
      y2 = snapPoint.y;
    } else if(perfectMode) {
      let position: Point = Angle.snapLineEnd(this.startPos.x, x2, this.startPos.y, y2) as Point;
      x2 = position.x;
      y2 = position.y;
    }

    xPointed.replacePoint(1, {x: x2, y: y2});

  }

}
