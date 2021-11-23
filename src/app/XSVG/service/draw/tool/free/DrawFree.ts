import {MoveDraw} from "../../mode/MoveDraw";
import {XElement} from "../../../../element/XElement";
import {XFree} from "../../../../element/line/XFree";

export class DrawFree extends MoveDraw {
  onStart(containerRect: DOMRect, event: MouseEvent): XElement {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let y1 = event.clientY - containerRect.top;  //y position within the element.

    let xPolyLine: XFree = new XFree([
      {x: x1, y: y1}
    ]);
    if(xPolyLine.boundingBox)
      xPolyLine.boundingBox.SVG.style.display = "none";

    return xPolyLine;
  }

  onDraw(containerRect: DOMRect, event: MouseEvent, xElement: XElement, perfectMode: boolean): void {
    let nextX = event.clientX - containerRect.left;
    let nextY = event.clientY - containerRect.top;

    xElement.setAttr({
      points: xElement.getAttr("points") + " " + nextX + " " + nextY
    });
  }

  onEnd(containerRect?: DOMRect, event?: MouseEvent, xElement?: XElement): boolean {
    if(
      xElement?.getAttr("points").split(" ").length == 2
    ) {
      xElement?.remove();
      return false;
    }
    return true;
  }

}
