import {ClickDraw} from "../../mode/ClickDraw";
import {XElement} from "../../../../element/XElement";
import {XPolygon} from "../../../../element/shape/XPolygon";

export class DrawPolygon extends ClickDraw {
  private xPolygon: XPolygon | null = null;

  onClick(containerRect: DOMRect, event: MouseEvent): XElement | null {
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

    this.xPolygon.removePoint(-1);
    this.xPolygon.pushPoint({x: x, y: y});
  }


  onStop() {
    if(!this.xPolygon) return;
    if(this.xPolygon.isSingleLine()) {
      this.xPolygon.remove();
    } else {
      this.xPolygon.removePoint(-1);
    }
    this.xPolygon = null;
  }
}
