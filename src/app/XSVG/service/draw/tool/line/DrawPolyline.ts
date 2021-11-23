import {ClickDraw} from "../../mode/ClickDraw";
import {XPolyline} from "../../../../element/line/XPolyline";
import {XElement} from "../../../../element/XElement";

export class DrawPolyline extends ClickDraw {
  private xPolyline: XPolyline | null = null;

  onClick(containerRect: DOMRect, event: MouseEvent): XElement | null {
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

    this.xPolyline.removePoint(-1);
    this.xPolyline.pushPoint({x: x, y: y});
  }


  onStop() {
    if(!this.xPolyline) return;
    if(this.xPolyline.isSingleLine()) {
      this.xPolyline.remove();
    } else {
      this.xPolyline.removePoint(-1);
    }
    this.xPolyline = null;
  }

}
