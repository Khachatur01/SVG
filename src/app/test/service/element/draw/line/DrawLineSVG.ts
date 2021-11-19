import {DrawableSVG} from "../DrawableSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";
import {LineSVG} from "../../../../container/SVG/element/line/LineSVG";
import {Position} from "../../../../container/SVG/SVG";
import {Geometry} from "../../../../container/SVG/Geometry";

export class DrawLineSVG implements DrawableSVG {
  private _X1:number = 0;
  private _Y1:number = 0;

  onStart(containerRect: DOMRect, event: MouseEvent): LineSVG {
    let lineSVG: LineSVG = new LineSVG(0, 0, 0, 0)

    this._X1 = event.clientX - containerRect.left; //x position within the element.
    this._Y1 = event.clientY - containerRect.top;  //y position within the element.

    lineSVG.setAttr({
      x1: this._X1,
      y1: this._Y1,
      x2: this._X1,
      y2: this._Y1
    });

    return lineSVG;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {
    let x2 = event.clientX - containerRect.left;
    let y2 = event.clientY - containerRect.top;


    if(perfectMode) {
      let position: Position = Geometry.snapLineEnd(this._X1, x2, this._Y1, y2) as Position;
      x2 = position.x;
      y2 = position.y;
    }

    elementSVG.setAttr({
      x2: x2,
      y2: y2
    });
  }


  onEnd(containerRect?: DOMRect, event?: MouseEvent, elementSVG?: ElementSVG): boolean {
    if(
      elementSVG?.getAttr("x1") == elementSVG?.getAttr("x2") &&
      elementSVG?.getAttr("y1") == elementSVG?.getAttr("y2")
    ) {
      elementSVG?.remove();
      return false;
    }

    return true;
  }
  disable(): void {
  }

}
