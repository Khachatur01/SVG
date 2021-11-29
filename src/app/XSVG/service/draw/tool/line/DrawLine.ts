import {MoveDraw} from "../../mode/MoveDraw";
import {XElement} from "../../../../element/XElement";
import {XLine} from "../../../../element/line/XLine";
import {Point} from "../../../../model/Point";
import {Geometry} from "../../../math/Geometry";
import {ClickDraw} from "../../mode/ClickDraw";
import {XPolyline} from "../../../../element/line/XPolyline";

export class DrawLine extends MoveDraw {
  private startPos: Point = {x: 0, y: 0};

  onStart(containerRect: DOMRect, event: MouseEvent): XElement {
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    return new XLine(this.startPos.x, this.startPos.y, this.startPos.x, this.startPos.y);
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, xElement: XElement, perfectMode: boolean): void {
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;

    if(perfectMode) {
      let position: Point = Geometry.snapLineEnd(this.startPos.x, x2, this.startPos.y, y2) as Point;
      x2 = position.x;
      y2 = position.y;
    }

    xElement.setAttr({
      x2: x2,
      y2: y2
    });
  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, xElement?: XElement): boolean {
    if(
      xElement?.getAttr("x1") == xElement?.getAttr("x2") &&
      xElement?.getAttr("y1") == xElement?.getAttr("y2")
    ) {
      xElement?.remove();
      return false;
    }

    return true;
  }

}

