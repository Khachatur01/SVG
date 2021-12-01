import {ClickDraw} from "../../mode/ClickDraw";
import {XPolyline} from "../../../../element/pointed/XPolyline";
import {XPointed} from "../../../../element/type/XPointed";

export class DrawPolyline extends ClickDraw {
  private xPolyline: XPolyline | null = null;

  onClick(containerRect: DOMRect, event: MouseEvent): XPointed | null {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let y1 = event.clientY - containerRect.top;  //y position within the element.

    if(!this.xPolyline) {
      this.xPolyline = new XPolyline([
        {x: x1, y: y1},
        {x: x1, y: y1}
      ]);
      return this.xPolyline;
    }

    this.xPolyline.pushPoint({x: x1, y: y1});

    return null;
  }

  onMove(containerRect: DOMRect, event: MouseEvent, perfectMode: boolean): void {
    if(!this.xPolyline) return;

    let x = event.clientX - containerRect.left; //x position within the element.
    let y = event.clientY - containerRect.top;  //y position within the element.

    this.xPolyline.replacePoint(-1,{x: x, y: y});
  }


  onStop() {
    if(!this.xPolyline) return;
    if(!this.xPolyline.isComplete()) {
      this.xPolyline.remove();
    } else {
      this.xPolyline.removePoint(-1);
    }
    this.xPolyline = null;
  }

}
