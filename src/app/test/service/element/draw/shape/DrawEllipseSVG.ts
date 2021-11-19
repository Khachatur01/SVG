import {DrawableSVG} from "../DrawableSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";
import {EllipseSVG} from "../../../../container/SVG/element/shape/EllipseSVG";

export class DrawEllipseSVG implements DrawableSVG {
  private _startX:number = 0;
  private _startY:number = 0;

  onStart(containerRect: DOMRect, event: MouseEvent): EllipseSVG {
    let ellipseSVG: EllipseSVG = new EllipseSVG(0, 0, 0, 0)

    this._startX = event.clientX - containerRect.left; //x position within the element.
    this._startY = event.clientY - containerRect.top;  //y position within the element.

    ellipseSVG.setAttr({
      cx: this._startX,
      cy: this._startY
    });

    return ellipseSVG;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {
    let dx = event.clientX - containerRect.left - this._startX;
    let dy = event.clientY - containerRect.top - this._startY;
    let x, y, rx, ry;

    if (dx > 0) {
      x = this._startX;
      rx = dx;
    } else {
      x = this._startX + dx;
      rx = -dx;
    }

    if (dy > 0) {
      y = this._startY;
      ry = dy;
    } else {
      y = this._startY + dy;
      ry = -dy;
    }

    /* to draw on the top left */
    rx /= 2;
    ry /= 2;

    if(perfectMode) {
      rx = ry = (rx + ry) / 2;
      let delta = (dx + dy) / 2
      if(dx < 0 && dy < 0) {
        x = this._startX + delta;
        y = this._startY + delta;
      } else if (dx < 0) {
        x = this._startX - rx * 2;
      } else if (dy < 0) {
        y = this._startY - ry * 2;
      }
    }

    elementSVG.setAttr({
      cx: x + rx,
      cy: y + ry,
      rx: rx,
      ry: ry
    });
  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, elementSVG?: ElementSVG): boolean {
    try{
      elementSVG?.getAttr("rx");
      elementSVG?.getAttr("ry");
      return true;
    } catch (ParserError) {
      elementSVG?.remove();
      return false;
    }

  }

  disable(): void {
  }
}
