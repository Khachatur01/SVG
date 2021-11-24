import {MoveDraw} from "../../mode/MoveDraw";
import {XElement} from "../../../../element/XElement";
import {XRectangle} from "../../../../element/shape/XRectangle";
import {Point} from "../../../../model/Point";

export class DrawRectangle extends MoveDraw {
  private startPos: Point = {x: 0, y: 0}

  onStart(containerRect: DOMRect, event: MouseEvent): XElement {
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    return new XRectangle(this.startPos.x, this.startPos.y, 0, 0);
  }
  onDraw(containerRect: DOMRect, event: MouseEvent, xElement: XElement, perfectMode: boolean): void {
    let dx = event.clientX - containerRect.left - this.startPos.x;
    let dy = event.clientY - containerRect.top - this.startPos.y;
    let x, y, width, height;

    if (dx > 0) {
      x = this.startPos.x;
      width = dx;
    } else {
      x = this.startPos.x + dx;
      width = -dx;
    }

    if (dy > 0) {
      y = this.startPos.y;
      height = dy;
    } else {
      y = this.startPos.y + dy;
      height = -dy;
    }

    if(perfectMode) {
      width = height = (width + height) / 2;
      let delta = (dx + dy) / 2
      if(dx < 0 && dy < 0) {
        x = this.startPos.x + delta;
        y = this.startPos.y + delta;
      } else if (dx < 0) {
        x = this.startPos.x - width;
      } else if (dy < 0) {
        y = this.startPos.y - height;
      }
    }

    xElement.setAttr({
      x: x,
      y: y,
      width: width,
      height: height
    });
  }
  onEnd(containerRect?: DOMRect, event?: MouseEvent, xElement?: XElement): boolean {
    try{
      xElement?.getAttr("width");
      xElement?.getAttr("height");
      return true;
    } catch (ParserError) {
      xElement?.remove();
      return false;
    }
  }
}
