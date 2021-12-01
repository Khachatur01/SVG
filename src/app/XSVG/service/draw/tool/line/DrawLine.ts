import {MoveDraw} from "../../mode/MoveDraw";
import {XLine} from "../../../../element/pointed/XLine";
import {Point} from "../../../../model/Point";
import {Geometry} from "../../../math/Geometry";
import {XPointed} from "../../../../element/type/XPointed";

export class DrawLine extends MoveDraw {
  private startPos: Point = {x: 0, y: 0};

  onStart(containerRect: DOMRect, event: MouseEvent): XPointed {
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    return new XLine(this.startPos.x, this.startPos.y, this.startPos.x, this.startPos.y);
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, xPointed: XPointed, perfectMode: boolean): void {
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;

    if(perfectMode) {
      let position: Point = Geometry.snapLineEnd(this.startPos.x, x2, this.startPos.y, y2) as Point;
      x2 = position.x;
      y2 = position.y;
    }

    xPointed.replacePoint(1, {x: x2, y: y2});

  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, xPointed?: XPointed): boolean {
    if(!xPointed?.isComplete()) {
      xPointed?.remove();
      return false;
    };
    return true;
  }

}
