import {MoveDraw} from "../../mode/MoveDraw";
import {XElement} from "../../../../element/XElement";
import {XEllipse} from "../../../../element/shape/XEllipse";

export class DrawEllipse extends MoveDraw {
  onStart(containerRect: DOMRect, event: MouseEvent): XElement {
    this.startPos.x = event.clientX - containerRect.left; //x position within the element.
    this.startPos.y = event.clientY - containerRect.top;  //y position within the element.

    let element = new XEllipse(this.startPos.x, this.startPos.y);
    element.fixPosition();
    return element;
  }

}
