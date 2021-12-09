import {ClickDraw} from "../../mode/ClickDraw";
import {XPolyline} from "../../../../../element/pointed/XPolyline";
import {XPointed} from "../../../../../element/type/XPointed";

export class DrawPolyline extends ClickDraw {

  onClick(containerRect: DOMRect, event: MouseEvent): XPointed | null {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let y1 = event.clientY - containerRect.top;  //y position within the element.

    if(!this.drawableElement) {
      this.drawableElement = new XPolyline([
        {x: x1, y: y1},
        {x: x1, y: y1}
      ]);
      return this.drawableElement;
    }

    this.drawableElement?.pushPoint({x: x1, y: y1});

    return null;
  }

}
