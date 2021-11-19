import {DrawableSVG} from "../DrawableSVG";
import {ElementSVG} from "../../../../container/SVG/element/ElementSVG";
import {PolylineSVG} from "../../../../container/SVG/element/line/PolylineSVG";

export class DrawFreeSVG implements DrawableSVG {

  onStart(containerRect: DOMRect, event: MouseEvent): PolylineSVG {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let x2 = event.clientY - containerRect.top;  //y position within the element.

    return new PolylineSVG([x1, x2]);
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, elementSVG: ElementSVG, perfectMode: boolean): void {
    let nextX = event.clientX - containerRect.left;
    let nextY = event.clientY - containerRect.top;

    elementSVG.setAttr({
      points: elementSVG.getAttr("points") + " " + nextX + " " + nextY
    });
  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, elementSVG?: ElementSVG): boolean {
    if(
      elementSVG?.getAttr("points").split(" ").length == 2
    ) {
      elementSVG?.remove();
      return false;
    }
    return true;
  }

  disable(): void {
  }
}
