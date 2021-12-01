import {ClickDraw} from "../../mode/ClickDraw";
import {XPolygon} from "../../../../element/pointed/XPolygon";
import {XPointed} from "../../../../element/type/XPointed";

export class DrawPolygon extends ClickDraw {
  private xPolygon: XPolygon | null = null;

  onClick(containerRect: DOMRect, event: MouseEvent): XPointed | null {
    let x1 = event.clientX - containerRect.left; //x position within the element.
    let y1 = event.clientY - containerRect.top;  //y position within the element.

    if(!this.xPolygon) {
      this.xPolygon = new XPolygon([
        {x: x1, y: y1},
        {x: x1, y: y1}
      ]);
      return this.xPolygon;
    }

    this.xPolygon.pushPoint({x: x1, y: y1});

    return null;
  }

  onMove(containerRect: DOMRect, event: MouseEvent, perfectMode: boolean): void {
    if(!this.xPolygon) return;

    let x = event.clientX - containerRect.left; //x position within the element.
    let y = event.clientY - containerRect.top;  //y position within the element.

    this.xPolygon.replacePoint(-1, {x: x, y: y});
  }


  onStop() {
    if(!this.xPolygon) return;
    if(!this.xPolygon.isComplete()) {
      this.xPolygon.remove();
    } else {
      this.xPolygon.removePoint(-1);
    }
    this.xPolygon = null;
  }
}
