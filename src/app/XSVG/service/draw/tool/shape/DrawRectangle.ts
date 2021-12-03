import {MoveDraw} from "../../mode/MoveDraw";
import {XElement} from "../../../../element/XElement";
import {XRectangle} from "../../../../element/shape/XRectangle";

export class DrawRectangle extends MoveDraw {
  onStart(containerRect: DOMRect, event: MouseEvent): XElement {
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    return new XRectangle(this.startPos.x, this.startPos.y);
  }
}
