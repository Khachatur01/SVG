import {DrawableSVG} from "../DrawableSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";
import {PolygonSVG} from "../../../../container/SVG/element/shape/PolygonSVG";

export class DrawPolygonSVG implements DrawableSVG {
  private _polygonSVG: PolygonSVG | null = null;

  onStart(containerRect: DOMRect, event: MouseEvent): PolygonSVG {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let x2 = event.clientY - containerRect.top;  //y position within the element.

    if(!this._polygonSVG)
      this._polygonSVG = new PolygonSVG([x1, x2]);
    return this._polygonSVG;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {

  }

  onEnd(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG): boolean {
    let nextX = event.clientX - containerRect.left;
    let nextY = event.clientY - containerRect.top;

    this._polygonSVG?.setAttr({
      points: elementSVG.getAttr("points") + " " + nextX + "," + nextY
    });
    return true;
  }

  disable(): void {
    this._polygonSVG = null;
  }
}
