import {DrawableSVG} from "../DrawableSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";
import {PolylineSVG} from "../../../../container/SVG/element/line/PolylineSVG";

export class DrawPolylineSVG implements DrawableSVG {
  private _polylineSVG: PolylineSVG | null = null;

  onStart(containerRect: DOMRect, event: MouseEvent): PolylineSVG {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let x2 = event.clientY - containerRect.top;  //y position within the element.

    if(!this._polylineSVG)
      this._polylineSVG = new PolylineSVG([x1, x2]);

    return this._polylineSVG;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {

  }

  onEnd(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG): boolean {
    let nextX = event.clientX - containerRect.left;
    let nextY = event.clientY - containerRect.top;

    this._polylineSVG?.setAttr({
      points: elementSVG.getAttr("points") + " " + nextX + " " + nextY
    });
    return true;
  }

  disable(): void {
    this._polylineSVG = null;
  }


}
