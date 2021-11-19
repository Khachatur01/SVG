import {DrawableSVG} from "../DrawableSVG";
import {RectangleSVG} from "../../../../container/SVG/element/shape/RectangleSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";

export class DrawRectangleSVG implements DrawableSVG {
  private _startX:number = 0;
  private _startY:number = 0;

  onStart(containerRect: DOMRect, event: MouseEvent): RectangleSVG {
    let rectangleSVG: RectangleSVG = new RectangleSVG(0, 0, 0, 0)

    this._startX = event.clientX - containerRect.left; //x position within the element.
    this._startY = event.clientY - containerRect.top;  //y position within the element.

    rectangleSVG.setAttr({
      x: this._startX,
      y: this._startY
    });

    return rectangleSVG;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {
    let dx = event.clientX - containerRect.left - this._startX;
    let dy = event.clientY - containerRect.top - this._startY;
    let x, y, width, height;

    if (dx > 0) {
      x = this._startX;
      width = dx;
    } else {
      x = this._startX + dx;
      width = -dx;
    }

    if (dy > 0) {
      y = this._startY;
      height = dy;
    } else {
      y = this._startY + dy;
      height = -dy;
    }

    if(perfectMode) {
      width = height = (width + height) / 2;
      let delta = (dx + dy) / 2
      if(dx < 0 && dy < 0) {
        x = this._startX + delta;
        y = this._startY + delta;
      } else if (dx < 0) {
        x = this._startX - width;
      } else if (dy < 0) {
        y = this._startY - height;
      }
    }

    elementSVG.setAttr({
      x: x,
      y: y,
      width: width,
      height: height
    });
  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, elementSVG?: ElementSVG): boolean {
    try{
      elementSVG?.getAttr("width");
      elementSVG?.getAttr("height");
      return true;
    } catch (ParserError) {
      elementSVG?.remove();
      return false;
    }
  }
  disable(): void {
  }
}
