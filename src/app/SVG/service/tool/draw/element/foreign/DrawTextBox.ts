import {MoveDraw} from "../../mode/MoveDraw";
import {Point} from "../../../../../model/Point";
import {Element} from "../../../../../element/Element";
import {TextBox} from "../../../../../element/foreign/text/TextBox";

export class DrawTextBox extends MoveDraw {
  onStart(position: Point): Element {
    return new TextBox(this.container, position.x, position.y);
  }

  override onIsNotComplete() {
    if(!this.drawableElement) return;
    this.drawableElement.setSize({
      x: this.startPos.x,
      y: this.startPos.y,
      width: 200,
      height: 100
    }, null);
    this.drawableElement.refPoint = this.drawableElement?.center;
  }

  override onEnd() {
    this.container.editTool.on();
  }
}
